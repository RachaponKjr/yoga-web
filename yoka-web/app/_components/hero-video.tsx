export default function HeroVideo({ poster }: { poster: string }) {
  return (
    <video
      src="/vedio.mp4"
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
    />
  );
}
