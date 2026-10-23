export default function LogListLoading() {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 px-6 pt-32 pb-12"
    >
      <YogaLoadingIllustration />
      <p className="font-cormorant text-xl italic text-muted-foreground">
        Gathering your practice moments…
      </p>
    </div>
  );
}

function YogaLoadingIllustration() {
  return (
    <svg aria-hidden="true" focusable="false" className="h-auto w-36 shrink-0" viewBox="0 0 240 220" fill="none">
      <g stroke="var(--secondary-foreground)" strokeWidth="1.2" opacity=".55">
        <path d="M39 173C17 119 39 61 88 42M201 173C223 119 201 61 152 42"/>
        <path d="M33 145C21 134 20 123 24 115C34 122 38 132 33 145ZM35 111C30 97 34 86 42 80C47 92 44 104 35 111ZM207 145C219 134 220 123 216 115C206 122 202 132 207 145ZM205 111C210 97 206 86 198 80C193 92 196 104 205 111Z" fill="var(--secondary-foreground)" stroke="none"/>
      </g>
      <path d="M120 17l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z" fill="var(--primary)"/>
      <circle cx="120" cy="67" r="16" stroke="var(--muted-foreground)" strokeWidth="2"/>
      <path d="M105 62C106 44 132 43 135 62M111 68l3 1M126 69l3-1M116 77q4 3 8 0" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M112 85L99 99L88 135L66 150M128 85L141 99L152 135L174 150" stroke="var(--muted-foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M107 102C106 121 106 135 100 145Q120 157 140 145C134 135 134 121 133 102" fill="var(--secondary)" fillOpacity=".35" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M100 145C80 138 49 151 54 165C59 177 93 179 120 170C147 179 181 177 186 165C191 151 160 138 140 145M66 158C88 157 106 176 143 176M174 158C156 157 141 166 120 170" stroke="var(--muted-foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M111 110q9 7 18 0M68 149q-5 3-10 1M172 149q5 3 10 1" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M49 190Q120 196 191 190" stroke="var(--secondary-foreground)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M85 205h22m26 0h22" stroke="var(--border)" strokeWidth="1"/>
      <path d="M120 200l1.5 4 4 1-4 1-1.5 4-1.5-4-4-1 4-1Z" fill="var(--primary)"/>
    </svg>
  );
}
