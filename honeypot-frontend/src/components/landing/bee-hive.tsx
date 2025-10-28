import Image from "next/image";

const HIVE_PATTERN = [3, 4, 5, 6, 5, 4, 3];
const MAX_ROW_COUNT = Math.max(...HIVE_PATTERN);
const MOBILE_ROW_SIZE = 4;

export interface BeeHiveProps {
  images: string[];
}

export function BeeHive({ images }: BeeHiveProps) {
  if (images.length === 0) {
    return null;
  }

  const totalCells = HIVE_PATTERN.reduce((acc, count) => acc + count, 0);
  const preparedImages = images.length >= totalCells ? images.slice(0, totalCells) : expandImages(images, totalCells);

  const mobileRows: string[][] = [];
  const mobileRowOffsets: number[] = [];
  for (let index = 0; index < preparedImages.length; index += MOBILE_ROW_SIZE) {
    mobileRowOffsets.push(index);
    mobileRows.push(preparedImages.slice(index, index + MOBILE_ROW_SIZE));
  }

  const hexRows: string[][] = [];
  const hexRowOffsets: number[] = [];
  let runningIndex = 0;
  HIVE_PATTERN.forEach((count) => {
    hexRowOffsets.push(runningIndex);
    hexRows.push(preparedImages.slice(runningIndex, runningIndex + count));
    runningIndex += count;
  });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-1 sm:gap-8 sm:px-0">
      <div className="bee-showcase w-full sm:hidden">
        {mobileRows.map((row, rowIndex) => (
          <div
            key={`bee-strip-${rowIndex}`}
            className={`bee-strip${rowIndex % 2 === 1 ? " bee-strip--reverse" : ""}`}
            style={{ ["--bee-strip-count" as string]: String(row.length) }}
          >
            {row.map((src, idx) => {
              const globalIndex = mobileRowOffsets[rowIndex] + idx;
              const floatDuration = 9000 + (globalIndex % 5) * 1500;
              const floatDelay = (globalIndex % 7) * 180;

              return (
                <div
                  key={`${src}-${globalIndex}-mobile`}
                  className="bee-strip__cell"
                  style={{
                    animationDuration: `${floatDuration}ms`,
                    animationDelay: `${floatDelay}ms`,
                  }}
                >
                  <Image
                    src={src}
                    alt={`HoneyPot Bee #${globalIndex + 1}`}
                    fill
                    sizes="(max-width: 640px) 24vw, 160px"
                    priority={globalIndex < 6}
                    className="bee-image"
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="bee-hive hidden w-full flex-col items-center sm:flex">
        <div className="bee-hive__grid">
          {hexRows.map((rowImages, rowIndex) => {
            const shouldOffset = rowIndex % 2 === 1 && rowImages.length < MAX_ROW_COUNT;
            const rowStartIndex = hexRowOffsets[rowIndex];

            return (
              <div
                key={`bee-row-${rowIndex}`}
                className={`bee-hive-row${shouldOffset ? " bee-hive-row--offset" : ""}`}
              >
                {rowImages.map((src, idx) => {
                  const globalIndex = rowStartIndex + idx;
                  const floatDuration = 9000 + (globalIndex % 5) * 1500;
                  const floatDelay = (globalIndex % 7) * 180;

                  return (
                    <div
                      key={`${src}-${globalIndex}-${idx}`}
                      className="bee-cell"
                      style={{
                        animationDuration: `${floatDuration}ms`,
                        animationDelay: `${floatDelay}ms`,
                      }}
                    >
                      <Image
                        src={src}
                        alt={`HoneyPot Bee #${globalIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 112px, (max-width: 1280px) 140px, 160px"
                        priority={globalIndex < 6}
                        className="bee-image"
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <p className="max-w-2xl text-sm text-stone-300/80 sm:text-base">
        A glimpse at the HoneyPot Bee collection – randomized in the hive each visit to keep the colony in motion.
      </p>
    </div>
  );
}

function expandImages(images: string[], target: number) {
  const expanded: string[] = [];
  for (let index = 0; index < target; index += 1) {
    expanded.push(images[index % images.length]);
  }
  return expanded;
}
