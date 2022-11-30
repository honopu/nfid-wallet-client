import clsx from "clsx"
import React from "react"

interface NFIDLogoIDProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NFIDLogoID: React.FC<NFIDLogoIDProps> = ({ className }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("", className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.7942 2.43266C12.4324 2.36461 12.8947 1.79206 12.8266 1.15382C12.7586 0.515577 12.186 0.0533447 11.5478 0.121392L9.17429 0.374447C7.95825 0.504089 6.98293 0.608067 6.19083 0.751678C5.37482 0.899623 4.67548 1.10186 4.02595 1.46587C2.9714 2.05687 2.09713 2.9229 1.49662 3.97168C1.12668 4.61776 0.918394 5.31498 0.763553 6.12903C0.613269 6.91914 0.501177 7.89254 0.361451 9.10591L0.355432 9.15818L0.122377 11.4759C0.0581603 12.1146 0.523819 12.6843 1.16246 12.7485C1.80109 12.8128 2.37087 12.3471 2.43508 11.7085L2.66646 9.40743C2.81191 8.14448 2.9148 7.25828 3.04698 6.56336C3.17671 5.88136 3.32151 5.46236 3.51373 5.12664C3.90496 4.44338 4.4747 3.87887 5.16231 3.49352C5.50032 3.30409 5.92136 3.1628 6.60548 3.03876C7.30399 2.91212 8.1946 2.81644 9.46459 2.68104L11.7942 2.43266ZM34.4074 1.15382C34.3394 1.79206 34.8016 2.36461 35.4398 2.43266L37.7694 2.68104C39.0394 2.81644 39.93 2.91212 40.6286 3.03876C41.3127 3.1628 41.7337 3.30409 42.0717 3.49352C42.7593 3.87887 43.3291 4.44338 43.7203 5.12664C43.9125 5.46236 44.0573 5.88136 44.1871 6.56336C44.3192 7.25828 44.4221 8.14448 44.5676 9.40743L44.799 11.7085C44.8632 12.3471 45.4329 12.8128 46.0716 12.7485C46.7102 12.6843 47.1759 12.1146 47.1117 11.4759L46.8786 9.15818L46.8726 9.10591L46.8726 9.10576C46.7329 7.89246 46.6208 6.91911 46.4705 6.12903C46.3156 5.31498 46.1074 4.61776 45.7374 3.97168C45.1369 2.9229 44.2626 2.05687 43.2081 1.46587C42.5586 1.10186 41.8592 0.899623 41.0432 0.751678C40.2511 0.608067 39.2758 0.504089 38.0598 0.374447L35.6863 0.121392C35.048 0.0533447 34.4755 0.515577 34.4074 1.15382ZM34.4074 46.0757C34.3394 45.4374 34.8016 44.8649 35.4398 44.7968L37.7694 44.5485C39.0394 44.4131 39.93 44.3174 40.6286 44.1907C41.3127 44.0667 41.7337 43.9254 42.0717 43.736C42.7593 43.3506 43.3291 42.7861 43.7203 42.1028C43.9125 41.7671 44.0573 41.3481 44.1871 40.6661C44.3192 39.9712 44.4221 39.085 44.5676 37.8221L44.799 35.521C44.8632 34.8824 45.4329 34.4167 46.0716 34.4809C46.7102 34.5452 47.1759 35.1149 47.1117 35.7536L46.8786 38.0713L46.8726 38.1236L46.8726 38.1237C46.7329 39.337 46.6208 40.3104 46.4705 41.1005C46.3156 41.9145 46.1074 42.6117 45.7374 43.2578C45.1369 44.3066 44.2626 45.1726 43.2081 45.7636C42.5586 46.1276 41.8592 46.3299 41.0432 46.4778C40.2513 46.6214 39.2762 46.7254 38.0605 46.855L38.0601 46.855L38.0599 46.855L38.0598 46.855L35.6863 47.1081C35.048 47.1761 34.4755 46.7139 34.4074 46.0757ZM12.8266 46.0757C12.8947 45.4374 12.4324 44.8649 11.7942 44.7968L9.46459 44.5485C8.1946 44.4131 7.30399 44.3174 6.60548 44.1907C5.92136 44.0667 5.50032 43.9254 5.1623 43.736C4.4747 43.3506 3.90495 42.7861 3.51373 42.1028C3.32151 41.7671 3.1767 41.3481 3.04698 40.6661C2.9148 39.9712 2.8119 39.085 2.66646 37.8221L2.43508 35.521C2.37086 34.8824 1.80109 34.4167 1.16245 34.4809C0.523816 34.5452 0.0581571 35.1149 0.122374 35.7536L0.355429 38.0713L0.361448 38.1236C0.501174 39.337 0.613266 40.3104 0.76355 41.1005C0.918391 41.9145 1.12668 42.6117 1.49662 43.2578C2.09713 44.3066 2.9714 45.1726 4.02595 45.7636C4.67547 46.1276 5.37482 46.3299 6.19082 46.4778C6.98286 46.6214 7.95808 46.7254 9.17397 46.855L9.17417 46.855L9.17428 46.855L11.5478 47.1081C12.186 47.1761 12.7586 46.7139 12.8266 46.0757ZM12.1909 14.654C11.6387 14.654 11.1909 15.1017 11.1909 15.654V31.9182C11.1909 32.4705 11.6387 32.9182 12.1909 32.9182H15.3571C15.9094 32.9182 16.3571 32.4705 16.3571 31.9182V15.654C16.3571 15.1017 15.9094 14.654 15.3571 14.654H12.1909ZM20.7512 14.654C20.1989 14.654 19.7512 15.1017 19.7512 15.654V31.9182C19.7512 32.4705 20.1989 32.9182 20.7512 32.9182H28.3876C30.388 32.9182 32.1622 32.5442 33.7103 31.7962C35.2584 31.0483 36.4586 29.9872 37.311 28.613C38.1633 27.2389 38.5895 25.6299 38.5895 23.7861C38.5895 21.9423 38.1633 20.3333 37.311 18.9591C36.4586 17.5849 35.2584 16.5239 33.7103 15.7759C32.1622 15.0279 30.388 14.654 28.3876 14.654H20.7512ZM31.9361 27.465C30.9968 28.3521 29.7444 28.7957 28.1789 28.7957H25.2174C25.0517 28.7957 24.9174 28.6614 24.9174 28.4957V19.0765C24.9174 18.9108 25.0517 18.7765 25.2174 18.7765H28.1789C29.7444 18.7765 30.9968 19.22 31.9361 20.1071C32.8928 20.9943 33.3711 22.2206 33.3711 23.7861C33.3711 25.3516 32.8928 26.5779 31.9361 27.465Z"
        fill="url(#paint0_linear_863_1001)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_863_1001"
          x1="11.4149"
          y1="15.7561"
          x2="27.5483"
          y2="39.2062"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CC5CDC" />
          <stop offset="0.244792" stopColor="#7B66FF" />
          <stop offset="0.520833" stopColor="#1F8AF0" />
          <stop offset="0.760417" stopColor="#00D1FF" />
          <stop offset="1" stopColor="#3DEDD7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
