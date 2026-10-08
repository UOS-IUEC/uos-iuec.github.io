"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

import L from "@/components/L";
import type { AlbumEvent } from "@/lib/content";

/** 한 쪽에 보이는 행사 수. 넓은 화면에서 3장씩 두 줄이다. */
const PAGE_SIZE = 6;

/**
 * 행사 카드 격자. 카드마다 첫 사진을 표지로 크게 보이고 그 아래 행사명·날짜·장소를 적는다.
 * 행사가 많으면 PAGE_SIZE개씩 쪽을 나누고 아래 쪽 번호로 넘긴다.
 * 카드를 누르면 그 행사의 사진을 <dialog>로 크게 띄우고, 좌우 화살표 키(또는 버튼)로 넘기며
 * Esc나 바깥을 누르면 닫는다. 사진 크기를 JSON에 적지 않아도 되도록 고정 비율 상자에 채워 그린다.
 */
export default function AlbumGallery({ events }: { events: AlbumEvent[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const event = events[eventIndex];
  const photos = event?.photos ?? [];
  const current = photos[photoIndex];
  const many = photos.length > 1;

  const pageCount = Math.ceil(events.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const visible = events.slice(start, start + PAGE_SIZE);

  // 쪽을 넘기면 목록 맨 위로 올라가 새 쪽의 첫 카드부터 보이게 한다
  function goTo(next: number) {
    setPage(next);
    listRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function open(next: number) {
    setEventIndex(next);
    setPhotoIndex(0);
    dialogRef.current?.showModal();
  }

  function step(delta: number) {
    setPhotoIndex((i) => (i + delta + photos.length) % photos.length);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
  }

  // 사진 바깥(어두운 배경)을 누르면 닫는다. dialog 자신이 눌린 경우만 해당한다.
  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) dialogRef.current?.close();
  }

  const pageButton =
    "min-w-9 rounded border px-2 py-1.5 tabular-nums hover:bg-surface hover:text-ink disabled:pointer-events-none disabled:opacity-30";
  const navButton =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-ink/60 px-3 py-2 text-xl leading-none text-canvas hover:bg-ink/80";

  return (
    <>
      <ul
        ref={listRef}
        className="grid scroll-mt-24 grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10"
      >
        {visible.map((item, i) => {
          const cover = item.photos[0];
          if (!cover) return null;
          const count = item.photos.length;

          return (
            <li key={item.id}>
              {/* 카드 전체가 버튼이다. 표지는 꾸밈이라 alt를 비우고, 이름은 아래 행사명이 맡는다. */}
              <button
                type="button"
                onClick={() => open(start + i)}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-md border border-line bg-surface">
                  <Image
                    src={cover.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 310px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {count > 1 ? (
                    <span className="absolute bottom-2 right-2 rounded bg-ink/70 px-1.5 py-0.5 text-xs tabular-nums text-canvas">
                      <L en={`${count} photos`} ko={`${count}장`} fit="center" />
                    </span>
                  ) : null}
                </span>
                <span className="mt-3 block break-keep font-semibold leading-snug group-hover:text-accent">
                  <L {...item.title} />
                </span>
                <span className="mt-1 block text-sm tabular-nums text-ink-muted">{item.date}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {pageCount > 1 ? (
        <nav aria-label="Album pages" className="mt-12 flex items-center justify-center gap-1 text-sm">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
            className={`${pageButton} border-transparent text-ink-muted`}
          >
            &lsaquo;
          </button>
          {Array.from({ length: pageCount }, (_, p) => (
            <button
              key={p}
              type="button"
              onClick={() => goTo(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${pageButton} ${
                p === page ? "border-accent font-semibold text-accent" : "border-transparent text-ink-muted"
              }`}
            >
              {p + 1}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo(page + 1)}
            disabled={page === pageCount - 1}
            aria-label="Next page"
            className={`${pageButton} border-transparent text-ink-muted`}
          >
            &rsaquo;
          </button>
        </nav>
      ) : null}

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onKeyDown={onKeyDown}
        onClick={onBackdropClick}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/90"
      >
        {event && current ? (
          <figure className="relative flex h-[85vh] w-[92vw] max-w-5xl flex-col">
            <div className="relative flex-1">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="92vw"
                className="object-contain"
              />
              {/* dialog 바깥으로 나가면 잘리므로 닫기 버튼은 사진 영역 안 오른쪽 위에 둔다 */}
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close"
                className="absolute right-2 top-2 rounded-full bg-ink/60 px-3 py-1.5 text-xl leading-none text-canvas hover:bg-ink/80"
              >
                &times;
              </button>
              {many ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className={`${navButton} left-2`}
                  >
                    &lsaquo;
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className={`${navButton} right-2`}
                  >
                    &rsaquo;
                  </button>
                </>
              ) : null}
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm text-canvas">
              <span className="break-keep">
                <span className="block font-medium">
                  <L {...event.title} />
                </span>
                {current.caption ? (
                  <span className="mt-0.5 block">
                    <L {...current.caption} />
                  </span>
                ) : null}
              </span>
              {many ? (
                <span className="shrink-0 tabular-nums">
                  {photoIndex + 1} / {photos.length}
                </span>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </dialog>
    </>
  );
}
