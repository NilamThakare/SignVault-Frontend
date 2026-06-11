import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  Upload, ChevronRight, ChevronLeft,
  Send, Fingerprint, Loader2, CheckCircle, X, FileText
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createAndSendContract } from '../api/contracts';
import { signContract } from '../api/signatures';
import dayjs from 'dayjs';

const detailsSchema = z.object({
  title: z.string().min(3, 'Contract title is required'),
  receiverEmail: z.string().email('Enter a valid receiver email'),
  periodType: z.enum(['DAYS', 'MONTHS', 'YEARS', 'PERMANENT']),
  periodValue: z.string().optional(),
  periodFrom: z.string().min(1, 'Start date is required'),
});

const steps = ['Upload PDF', 'Contract Details', 'Preview & Sign'];

export default function CreateContractPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(detailsSchema),
    defaultValues: { periodType: 'DAYS' }
  });

  const periodType = watch('periodType');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        toast.error('Only PDF files under 10MB are allowed.');
        return;
      }
      setPdfFile(acceptedFiles[0]);
    }
  });

  const handleNextStep = () => {
    if (!pdfFile) { toast.error('Please select a PDF file.'); return; }
    setCurrentStep(1);
  };

  const onDetailsSubmit = (data) => {
    setFormData(data);
    setCurrentStep(2);
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const fingerprintString = await simulateFingerprintScan();

      const contractData = {
        title: formData.title,
        receiverEmail: formData.receiverEmail,
        periodType: formData.periodType,
        periodValue: formData.periodType !== 'PERMANENT' ? parseInt(formData.periodValue) : null,
        periodFrom: formData.periodFrom,
      };

      const multipartForm = new FormData();
      multipartForm.append('data', new Blob([JSON.stringify(contractData)], { type: 'application/json' }));
      multipartForm.append('file', pdfFile);

      const res = await createAndSendContract(multipartForm);
      const contractId = res.data?.data?.contractId || res.data?.contractId;

      if (contractId) {
        await signContract(contractId, fingerprintString);
      }

      toast.success('Contract sent successfully!');
      navigate('/contracts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send contract.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Contract</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Upload a PDF, fill in details, and send for signing.
        </p>
      </div>

      <div className="flex items-center">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={[
                'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all',
                i < currentStep ? 'bg-green-500 border-green-500 text-white' : '',
                i === currentStep ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : '',
                i > currentStep ? 'bg-white dark:bg-white/5 border-slate-300 dark:border-white/20 text-slate-400' : ''
              ].join(' ')}>
                {i < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={[
                'text-xs mt-1.5 font-medium hidden sm:block whitespace-nowrap',
                i === currentStep ? 'text-blue-600 dark:text-blue-400' : '',
                i < currentStep ? 'text-green-600 dark:text-green-400' : '',
                i > currentStep ? 'text-slate-400' : ''
              ].join(' ')}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={[
                'flex-1 h-0.5 mx-2 mb-4 transition-all',
                i < currentStep ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'
              ].join(' ')} />
            )}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Upload Contract PDF</h2>

          <div
            {...getRootProps()}
            className={[
              'border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-200',
              isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-slate-300 dark:border-white/20 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/5',
              pdfFile ? 'border-green-500 bg-green-50 dark:bg-green-500/10' : ''
            ].join(' ')}
          >
            <input {...getInputProps()} />
            {pdfFile ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">{pdfFile.name}</p>
                <p className="text-xs text-slate-500">{(pdfFile.size / 1024 / 1024).toFixed(2) + ' MB'}</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:underline mt-1"
                >
                  <X className="w-3 h-3" />
                  <span>Remove file</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">or click to browse files</p>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
                  PDF only · Max 10MB
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleNextStep}
            disabled={!pdfFile}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
          >
            <span>Continue</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Contract Details</h2>

          <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contract Title</label>
              <input
                {...register('title')}
                placeholder="e.g. Service Agreement — Acme Corp"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Receiver Email</label>
              <input
                {...register('receiverEmail')}
                type="email"
                placeholder="receiver@example.com"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.receiverEmail && <p className="text-red-500 text-xs mt-1">{errors.receiverEmail.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contract Period Type</label>
              <select
                {...register('periodType')}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="DAYS">Days</option>
                <option value="MONTHS">Months</option>
                <option value="YEARS">Years</option>
                <option value="PERMANENT">Permanent</option>
              </select>
            </div>

            {periodType !== 'PERMANENT' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {'Period Value (' + (periodType ? periodType.toLowerCase() : '') + ')'}
                </label>
                <input
                  {...register('periodValue')}
                  type="number"
                  min="1"
                  placeholder={periodType === 'DAYS' ? '30' : periodType === 'MONTHS' ? '6' : '1'}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Contract Start Date</label>
              <input
                {...register('periodFrom')}
                type="date"
                min={dayjs().format('YYYY-MM-DD')}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              {errors.periodFrom && <p className="text-red-500 text-xs mt-1">{errors.periodFrom.message}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="flex items-center gap-2 px-5 py-3 border border-slate-300 dark:border-white/20 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
              >
                <span>Preview & Sign</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {currentStep === 2 && formData && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 dark:text-white text-lg">Preview & Send</h2>

          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl divide-y divide-slate-200 dark:divide-white/10 border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Contract Title</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">{formData.title}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">PDF File</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right truncate">{pdfFile?.name}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Receiver Email</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">{formData.receiverEmail}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Period Type</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">{formData.periodType}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Period Value</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                {formData.periodType !== 'PERMANENT'
                  ? formData.periodValue + ' ' + formData.periodType.toLowerCase()
                  : 'Permanent'
                }
              </span>
            </div>
            <div className="flex justify-between items-center px-5 py-3.5 gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Start Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                {dayjs(formData.periodFrom).format('DD MMM YYYY')}
              </span>
            </div>
          </div>

          <div className={[
            'rounded-2xl border p-6 flex flex-col items-center text-center gap-4 transition-all',
            sending
              ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20'
              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
          ].join(' ')}>
            <div className={[
              'w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all',
              sending
                ? 'border-blue-500 bg-blue-100 dark:bg-blue-500/20 animate-pulse'
                : 'border-slate-300 dark:border-white/20 bg-white dark:bg-white/5'
            ].join(' ')}>
              {sending
                ? <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
                : <Fingerprint className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {sending ? 'Signing & Sending...' : 'Fingerprint required to sign'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your biometric signature will be attached to this contract.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              disabled={sending}
              className="flex items-center gap-2 px-5 py-3 border border-slate-300 dark:border-white/20 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-green-500/20"
            >
              {sending
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing & Sending...</span></>
                : <><Fingerprint className="w-4 h-4" /><Send className="w-4 h-4" /><span>Sign & Send</span></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

async function simulateFingerprintScan() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('BIO_' + Math.random().toString(36).substring(2, 18).toUpperCase());
    }, 2000);
  });
}
