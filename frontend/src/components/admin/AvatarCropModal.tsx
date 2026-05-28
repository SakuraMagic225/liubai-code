import { PointerEvent, useEffect, useRef, useState } from 'react';

interface AvatarCropModalProps {
  file: File;
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

const CROP_SIZE = 320;
const OUTPUT_SIZE = 512;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function AvatarCropModal({ file, confirming = false, onCancel, onConfirm }: AvatarCropModalProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef({ pointerId: 0, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  const [imageUrl, setImageUrl] = useState('');
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const nextImageUrl = URL.createObjectURL(file);
    setImageUrl(nextImageUrl);
    setNaturalSize({ width: 0, height: 0 });
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setError('');

    return () => {
      URL.revokeObjectURL(nextImageUrl);
    };
  }, [file]);

  const baseScale =
    naturalSize.width > 0 && naturalSize.height > 0
      ? Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height)
      : 1;
  const displaySize = {
    width: naturalSize.width * baseScale * zoom,
    height: naturalSize.height * baseScale * zoom,
  };

  function limitOffset(nextOffset: { x: number; y: number }) {
    const maxX = Math.max(0, (displaySize.width - CROP_SIZE) / 2);
    const maxY = Math.max(0, (displaySize.height - CROP_SIZE) / 2);

    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  }

  useEffect(() => {
    setOffset((current) => limitOffset(current));
  }, [naturalSize.width, naturalSize.height, zoom]);

  function handleZoomChange(value: number) {
    setZoom(value);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    setOffset(
      limitOffset({
        x: dragRef.current.offsetX + event.clientX - dragRef.current.startX,
        y: dragRef.current.offsetY + event.clientY - dragRef.current.startY,
      }),
    );
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current.pointerId === event.pointerId) {
      setDragging(false);
    }
  }

  function handleConfirm() {
    const image = imageRef.current;
    if (!image || naturalSize.width <= 0 || naturalSize.height <= 0) {
      setError('图片还没有加载完成，请稍后再试');
      return;
    }

    const cropLeft = displaySize.width / 2 - CROP_SIZE / 2 - offset.x;
    const cropTop = displaySize.height / 2 - CROP_SIZE / 2 - offset.y;
    const sourceX = (cropLeft / displaySize.width) * naturalSize.width;
    const sourceY = (cropTop / displaySize.height) * naturalSize.height;
    const sourceSize = (CROP_SIZE / displaySize.width) * naturalSize.width;

    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const context = canvas.getContext('2d');

    if (!context) {
      setError('当前浏览器无法裁剪图片');
      return;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('头像裁剪失败，请换一张图片重试');
          return;
        }
        onConfirm(new File([blob], 'avatar-cropped.jpg', { type: 'image/jpeg' }));
      },
      'image/jpeg',
      0.94,
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-green-950/35 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-lg border border-green-100 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-coral-400">Crop</p>
            <h2 className="mt-1 text-xl font-semibold text-green-800">调整头像裁剪范围</h2>
            <p className="mt-2 text-sm text-green-600/75">拖动图片选择范围，缩放后生成清晰的正方形头像。</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={confirming}
            className="rounded-md border border-green-100 bg-white px-3 py-2 text-sm text-green-700 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
          >
            取消
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-center">
          <div
            className={`relative mx-auto h-80 w-80 touch-none overflow-hidden rounded-lg border border-green-100 bg-green-50 ${
              dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {imageUrl ? (
              <img
                ref={imageRef}
                src={imageUrl}
                alt="待裁剪头像"
                draggable={false}
                onLoad={(event) => {
                  setNaturalSize({
                    width: event.currentTarget.naturalWidth,
                    height: event.currentTarget.naturalHeight,
                  });
                  setOffset({ x: 0, y: 0 });
                }}
                onError={() => setError('图片预览加载失败，请确认图片格式为 JPG、PNG 或 WebP')}
                className="absolute left-1/2 top-1/2 max-w-none select-none"
                style={{
                  width: naturalSize.width > 0 ? `${displaySize.width}px` : 'auto',
                  height: naturalSize.height > 0 ? `${displaySize.height}px` : 'auto',
                  transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                  opacity: naturalSize.width > 0 ? 1 : 0,
                }}
              />
            ) : null}
            <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white shadow-[0_0_0_999px_rgba(2,44,34,0.38)]" />
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-green-800" htmlFor="avatar-zoom">
                缩放
              </label>
              <input
                id="avatar-zoom"
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(event) => handleZoomChange(Number(event.target.value))}
                className="mt-3 w-full accent-coral-400"
              />
            </div>
            <div className="rounded-lg border border-green-100 bg-green-50/60 p-4 text-sm leading-7 text-green-700">
              <p>原图尺寸：{naturalSize.width > 0 ? `${naturalSize.width} x ${naturalSize.height}` : '读取中...'}</p>
              <p>输出尺寸：{OUTPUT_SIZE} x {OUTPUT_SIZE}</p>
              <p>建议让主体尽量落在圆形区域中间。</p>
            </div>
            {error ? <p className="text-sm text-coral-600">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className="rounded-md bg-coral-400 px-4 py-2 text-sm font-medium text-white hover:bg-coral-600 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirming ? '上传中...' : '确认裁剪并上传'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                }}
                className="rounded-md border border-green-100 bg-white px-4 py-2 text-sm font-medium text-green-700 hover:border-coral-100 hover:bg-coral-50 hover:text-coral-600"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
