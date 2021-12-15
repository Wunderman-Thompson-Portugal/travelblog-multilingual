import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function LanguageBar() {
  let router = useRouter();
  const [languageMapper, setLanguageMapper] = useState([]);
  const currentPath = useRouter().asPath;

  return (
    <section className="flex-col md:flex-row flex items-center md:justify-end mr-0 mt-0 mb-0 md:mb-0">

      <Link href={currentPath} locale="en">
        <a className="underline hover:text-success duration-200 transition-colors p-1">
          English
        </a>
      </Link>
      <Link href={currentPath} locale="it">
        <a className="underline hover:text-success duration-200 transition-colors p-1">
          Italian
        </a>
      </Link>
      <Link href={currentPath} locale="pt">
        <a className="underline hover:text-success duration-200 transition-colors p-1">
          Portuguese
        </a>
      </Link>
      <Link href={currentPath} locale="es">
        <a className="underline hover:text-success duration-200 transition-colors p-1">
          Spanish
        </a>
      </Link>
    </section>
  );
}
