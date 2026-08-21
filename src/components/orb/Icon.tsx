type IconProps = {
  name: "document" | "external" | "hub" | "media";
};

export default function Icon({ name }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      {name === "document" ? (
        <>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h5M9 12h6M9 16h6" />
        </>
      ) : name === "hub" ? (
        <>
          <circle cx="12" cy="12" r="3" />
          <circle cx="5" cy="6" r="2" />
          <circle cx="19" cy="6" r="2" />
          <circle cx="12" cy="20" r="2" />
          <path d="m7 7 3 3m7-3-3 3m-2 5v3" />
        </>
      ) : name === "media" ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m10 9 5 3-5 3z" />
        </>
      ) : (
        <>
          <path d="M14 5h5v5M19 5l-9 9" />
          <path d="M17 13v6H5V7h6" />
        </>
      )}
    </svg>
  );
}
