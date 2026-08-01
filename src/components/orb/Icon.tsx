type IconProps = {
  name: "document" | "external";
};

export default function Icon({ name }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      {name === "document" ? (
        <>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h5M9 12h6M9 16h6" />
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
