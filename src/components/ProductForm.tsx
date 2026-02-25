'use client';

import { useState, useTransition, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus, Loader2, ImagePlus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IProduct } from '@/types/products';

import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { toast } from 'sonner';
import { CATEGORIES, GENDERS } from '@/types/products';
import { createProduct, updateProduct } from '@/actions/Admin.action';

interface ProductFormProps {
  product?: IProduct;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
  gender: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: string;
  isFeatured: boolean;
  tags: string[];
};

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

function toForm(p?: IProduct): FormData {
  return {
    name: p?.name ?? '',
    description: p?.description ?? '',
    price: p?.price?.toString() ?? '',
    discountPrice: p?.discountPrice?.toString() ?? '',
    category: p?.category ?? '',
    gender: p?.gender ?? '',
    material: p?.material ?? '',
    sizes: p?.sizes ?? [],
    colors: p?.colors ?? [],
    images: p?.images ?? [],
    stock: p?.stock?.toString() ?? '',
    isFeatured: p?.isFeatured ?? false,
    tags: p?.tags ?? [],
  };
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<FormData>(toForm(product));
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, progress,error } = useCloudinaryUpload();

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const toggleSize = (s: string) =>
    set('sizes', form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]);

  const addColor = () => {
    const c = colorInput.trim();
    if (c && !form.colors.includes(c)) set('colors', [...form.colors, c]);
    setColorInput('');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      toast.info('Uploading image(s)…');
      const results = await Promise.all(files.map((f) => upload(f)));
      console.log(results)
      const urls = results.map((r) => r.url);
      set('images', [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded!`);
    } catch (err){
      toast.error('Image upload failed');
     console.log(err)
    }
    e.target.value = '';
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price required';
    if (!form.category) e.category = 'Category is required';
    if (!form.gender) e.gender = 'Gender is required';
    if (form.sizes.length === 0) e.sizes = 'Select at least one size';
    if (form.colors.length === 0) e.colors = 'Add at least one color';
    if (form.images.length === 0) e.images = 'Add at least one image';
    if (!form.stock || isNaN(Number(form.stock))) e.stock = 'Valid stock required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { toast.error('Please fix the form errors'); return; }

    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
    };

    startTransition(async () => {
      const res = product
      // @ts-ignore
        ? await updateProduct(product._id, payload)
        // @ts-ignore
        : await createProduct(payload);

      if (res.success) {
        toast.success(product ? 'Product updated!' : 'Product created!');
        onSuccess();
      } else {
        toast.error(res.message || 'Failed');
      }
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="field-label">Product Name</Label>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Premium Cotton Panjabi" className="rounded-xl" />
          {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2 space-y-1.5">
          <Label className="field-label">Description</Label>
          <Textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Describe the product…" className="rounded-xl resize-none" rows={3} />
          {errors.description && <p className="text-[11px] text-destructive">{errors.description}</p>}
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <Label className="field-label">Price (৳)</Label>
          <Input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="2850" className="rounded-xl" />
          {errors.price && <p className="text-[11px] text-destructive">{errors.price}</p>}
        </div>

        {/* Discount */}
        <div className="space-y-1.5">
          <Label className="field-label">Discount Price (৳) <span className="text-muted-foreground font-normal">optional</span></Label>
          <Input type="number" value={form.discountPrice} onChange={(e) => set('discountPrice', e.target.value)} placeholder="2450" className="rounded-xl" />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="field-label">Category</Label>
          <Select value={form.category} onValueChange={(v) => set('category', v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-[11px] text-destructive">{errors.category}</p>}
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <Label className="field-label">Gender</Label>
          <Select value={form.gender} onValueChange={(v) => set('gender', v)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-[11px] text-destructive">{errors.gender}</p>}
        </div>

        {/* Material */}
        <div className="space-y-1.5">
          <Label className="field-label">Material <span className="text-muted-foreground font-normal">optional</span></Label>
          <Input value={form.material} onChange={(e) => set('material', e.target.value)} placeholder="Cotton, Georgette…" className="rounded-xl" />
        </div>

        {/* Stock */}
        <div className="space-y-1.5">
          <Label className="field-label">Stock</Label>
          <Input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} placeholder="48" className="rounded-xl" />
          {errors.stock && <p className="text-[11px] text-destructive">{errors.stock}</p>}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <Label className="field-label">Sizes</Label>
        <div className="flex flex-wrap gap-1.5">
          {SIZE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                form.sizes.includes(s)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.sizes && <p className="text-[11px] text-destructive">{errors.sizes}</p>}
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <Label className="field-label">Colors</Label>
        <div className="flex gap-2">
          <Input value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addColor()} placeholder="e.g. Navy Blue" className="flex-1 rounded-xl text-sm" />
          <Button type="button" variant="outline" size="sm" onClick={addColor} className="rounded-xl gap-1">
            <Plus size={13} /> Add
          </Button>
        </div>
        {form.colors.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {form.colors.map((c) => (
              <span key={c} className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
                <span className="h-3 w-3 rounded-full border border-border/50" style={{ backgroundColor: c.toLowerCase().replace(/\s+/g, '') }} />
                {c}
                <button onClick={() => set('colors', form.colors.filter((x) => x !== c))}><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
        {errors.colors && <p className="text-[11px] text-destructive">{errors.colors}</p>}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label className="field-label">Images</Label>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50"
        >
          {uploading ? (
            <><Loader2 size={16} className="animate-spin" /> Uploading… {progress}%</>
          ) : (
            <><ImagePlus size={16} /> Click to upload images (Cloudinary)</>
          )}
        </button>
        {form.images.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {form.images.map((url, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
                <Image src={url} alt={`Product ${i + 1}`} fill className="object-cover" sizes="80px" />
                <button
                  onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.images && <p className="text-[11px] text-destructive">{errors.images}</p>}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label className="field-label">Tags <span className="text-muted-foreground font-normal">optional</span></Label>
        <div className="flex gap-2">
          <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="Eid, Festive, Premium…" className="flex-1 rounded-xl text-sm" />
          <Button type="button" variant="outline" size="sm" onClick={addTag} className="rounded-xl gap-1"><Plus size={13} /> Add</Button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {form.tags.map((t) => (
              <span key={t} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                #{t}
                <button onClick={() => set('tags', form.tags.filter((x) => x !== t))}><X size={9} /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Featured Product</p>
          <p className="text-[11px] text-muted-foreground">Show in the featured section on homepage</p>
        </div>
        <Switch checked={form.isFeatured} onCheckedChange={(v) => set('isFeatured', v)} />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={isPending} className="flex-1 rounded-xl">
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending} className="flex-1 rounded-xl font-bold">
          {isPending ? <><Loader2 size={14} className="animate-spin mr-2" /> Saving…</> : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </div>
  );
}