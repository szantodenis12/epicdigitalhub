/** Two-digit index label, "01".."06". Plain module (no "use client") so both
    server and client components can call it. */
export const nn = (i: number) => String(i + 1).padStart(2, "0");
