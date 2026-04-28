import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_aDIUQQGR7Z8t3KcAnCucade8xkJEI3Q",
  authDomain: "nueva-99f84.firebaseapp.com",
  projectId: "nueva-99f84",
  storageBucket: "nueva-99f84.firebasestorage.app",
  messagingSenderId: "990191002508",
  appId: "1:990191002508:web:290b9c11b5b0c294adeca9",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TEAMS = ["HO", "DO", "CO", "WO"];

const PLANS = [
  {
    id: "1",
    name: "From Halla 肉泥",
    sub: "貓／狗適用",
    tags: ["抗氧化", "無添加", "貓狗適用"],
    points: [
            "濟州島紅代龍蝦＆鮭魚",
      "濟州島無抗生素素雞肉",
      "濟州島比目魚 / 鮑魚＆鴨肉",
    ],
  },
  {
    id: "2",
    name: "漢方潔牙棒",
    sub: "狗適用",
    tags: ["78% 鮮肉", "老犬友善", "狗適用"],
    points: [
            "鹿牛＋龜鹿二仙膠",
      "豬肉＋蛋黃",
      "豬肉葛麥地瓜＋甘露飲 / 賴鮪南瓜奇亞籽＋甘露飲 / 黑水蛇大豆＋甘露飲",
    ],
  },
  {
    id: "3",
    name: "RESPET 口腔系列",
    sub: "貓／狗適用",
    tags: ["酵素凝膠", "口腔噴霧", "貓狗適用"],
    points: [
            "牙刷（0.07mm 超細刷毛）",
      "牙膏（春蕉風味）",
      "凝膠（雞肉風肉）/ 無色無味口腔噴霧",
    ],
  },
  {
    id: "4",
    name: "保健肉丁",
    sub: "貓／狗適用",
    tags: ["顧腸配方", "顧眼配方", "美膚配方"],
    points: [
            "鮪魚＋葉黃素（顧眼）",
      "雞肉＋益生菌（顧腸）",
      "牛肉＋膠原蛋白（美膚）",
    ],
  },
];

const PLAN_IMAGES = {
  "plan1": "data:image/jpeg;base64,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",
  "plan2": "data:image/jpeg;base64,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",
  "plan3": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDdmTEp+tM24q7dr85OKq/fBAqBk1oAXxithVCpzWJasVnUHoa1bqUJGBnrVITJuozTS9NiJMIJqpffafskv2PZ9ox8m/pTAs+au4ruGR1GeRTt4xXmy6pdx60biWQJOz7JB2I6Y/Su40+4adAT3oCxoEZFUzpdluaT7OmXO5uOpq72pAD3pMExmBHHhQB9KQGpGXgioz8isTk4HQUAP6jipITya5R9UWJrqe3c7EO9kQ5P5fnWhomsLqMAkTuSDSUrlOLRs3PKGuK8Q395a3CrHOywPgMo6EH/ACa7WfJhrntT043ojxCJQMhgTj8amautCqTSlqV9E1N1g+zHohyp9jz/AI1uPcBbd5W6IpY/hWda6Q0bh5MKQANq9KZ4knFnocvJy+EH8z/KnBNLUU2nLQ4LUbySS6+Vj5pbeT6c13WgXE81qhnkMjnncRiuAsIDc3CmT70rfpXo+kwCKEcUPcb2NVanjqJFz1qdBVGYSHCmsuY7pK0bg8YFZrf6zFJjRNHRSxjmigAvgVZuDVCH/WH0rX1GPIzWQPlc0MEWWRVkV+wpHka5mAHQHioySRjPFXLOMDnvTAuKAsagelJt60/tk0namSYFz4Xsbm9e5cMWkbJXPArXgtlgUKowBU4B+9gkCnAgjI5oC4iigjmnEDFNHPFACMeMVEeualI5puKAMHUNChmX/Rdts7Nlyo++O4NX9L02O0QJGoAHoMVYc/NirFvSsVd2HSj5MVXgX5s1bk6VAg259aBCE4c1U1LT4tRtjDNkDOQR1FWSfnNSjoKAOSh8LPb6gsqMhhVcDsfyro4IBGoFWiBjFNzg0rWG22OjXkVIeKRBzSyHFMRXlbk1RbDS1bmPFVFGHz2pMpFhQR9KKchyBRQIv3Cb0IrCuVKMa6Jx1rJvo8802JFCM9utaVsMAVmKCDmtG2cbQPWkhstg5p6KTxTIx2qdiI0x371RJCXKSHjKfyoZQfmQ/wD16oG4m85nALesXf8AD3p6TSI25MumeQeq/wCIqY1FLRFypuOpbDZ4IwR2peppAyTKPzH/ANakJKcNyP71XYgeBmon4JqaOop+M0gKp+ZqtQnFVkHINWEOBSGSE8UxR3p2eKUDC0AVm4kNMvLyOxtHuJSdiDoOpPpUkn3zVbUYVuLGVHi84bSQg6k9sUAYf/CVi61C2jtUZIv+WokHP0Fb8FwJuR3rz2HSb6S9QJBIiHncRjFdzp1tLEq76lNlyS6GvGaSXj8KVBjFR3LYJ+lUQVJWyaaoyay5tdsYJHWSXlRnGDz7Crlhfw3sCTRhk3fwt1FTctxaL6riilU0UyTTBytUrxODViNu1E6blNUSYTLh/apouJFx0pJF2sRVqzi3sCfuikMvRDam4/hVSaZ45WZvmj4+6OV+tW5HyMAYxxiqhCtLkHa/f3FN7aBHfUqTELJ5kuCrcrIi8e316CgboZWZ02kjAkJ4PHGffFXTGQx2Y65KNyD9KreQGlcRNgnG5HJOD1J9/wAK5pU5J3R0RmmrMhyyM3l/JNnO1uFb0HsTWismeH6nvVKazIdEU5j5yT1X/wCvTpZo7eEDJIUYyTk1rTcteYyny6cpdOIRuz8nof6UlwMrkVQt/NuJUeX5Y0OUT39TWlMP3daXMykOo+tTqOKgH3qtoucUhjM4PJp69BVdyHYg8HNOSQoMNyPWgBsnMlOUcUw8vkVKOlACbQT0p+MdKQCpACaAFAqten5CatDABqjfMCmKGBwF/YTTXMnlW7AF+PQCtvw/YXVuhErEjPAPatyBB6VbRAD0rNR6msqjasNAIAop7AUVZmTwNkZqyfmUis+1fsavxmqQihNCXkCqMk1ciQRoFRhxnJ9TTiqrJkkAn3qOR484255xwOlAEUu4Od3IPcCjClRu+8P0pzgY+Yb0Bzzzg0x124KnjPP/ANagY5Qw4bBHY96jm2sOW+YdG7imyS7MAkEVmXM/70sW2qvJJ6UPRBG7ZYuLoRx/M/CjljUVlA9y32iYYQfcQ/zNZsRfULpcgiBTkA/xe5rpo0CxADtSvcHoV1bbMBTr+7EVozrhmPyovq1Q3bCAGQnGKrWyCQeZJkyk5Az93/69Yzm+bkiawguXnkFqWjjjjyTtGCfetmEEQ7j1PSqdta5YVHdNdW24HLxNlQQenHbuO/6Vd+RbaEpc731J5FDcgj61Cs7RsEmXg9GHQ1mnfGkqR75IejRjgjsen9KuWzux8sfMoO0huNmB0Hr/AJ6VMavM7WLlS5Ve5aMePmjP1FSIwYejDsahii8gEITjOQCentUgwx54NaIxa7E61KBxVe1kEqlhyoOAfWp2OBTERyvtWs65bdgVPcyHpUGzdikxomgTAB71MOKYpCKT2HNZ1trcM6gyIYc8jcwORRsPc1CKKjSVWHBGPaigRFE2161ISCM54rPWAvME6Dua0QBCDj6D2oQWGyqwLSRIA5Xb83f8Kqr5kkJ+TDDjDYPNWvN3Hk1XndUDP0P1xT5eo1K2hFFMyB42h2FRvJ7HP+TULXCHAV1dDyCvb2pJZYwvLFuMcnNZ+5Y042xxrk4AwBSV1ZFOzuyW4mIBYMFUcsSegrOQSalLkZFup4H973NVpZ31GcRR5FuD/wB9V0VlCsEIwMUt2LZC2tusOMCtIMqwlmOAKg2ZTcKy7+7eQrbQnLMcDFRVqKnHzKpUnUY2Vn1C7IT/AFUZ5PbNW7VAr4qzFbLaWqxL1xyfU0y0iLzk/wAK8k0qdNxV3u9x1Z8zstkaEQCJk9TUFyryL+7kKMDnjv7UrXSBisnyDOASetVbrUIbV7dJdxadtq7RnmtmrqxktHcqS22WRt/2eQHaMdD9PT/69VzzIpcNDMh2Z9R3P+z+HrWzIFddrgEH1qpdRxPHgjaVG1WHUD2rCVLsdEa3cmklVVyCMdqzTLJfz+VGSsIPzsO/tVBTMSbVWyxY5C9EHoK6Cwtlt4VUCtE2zGSUXoW4EEcYVRgAYApJXwKVmCrVKaQscCrIIpW8yUKv41YCYIqOCPvVkjkUhmRr1jNeW8YgdxtY7lVsbhXPxQSvEFEUsZztIIwQBxXcEfLTPLUnkCk43KjKxmadC6RAMT+NFagUL0oosSaKwqOcc9abO2wZGB71NVa6YEbTVivYqGcMcnG4d6qTT85P4CoLvfESU5FUizsSztgDtmp5uho4J6pk0kigM5Kqo5J6ViXNy1+4jjyIQf8Avr3NJdTSX8nlR58oH/vqtCxsNgGRU3uO1ifTrQR4OOa2dvyACoYYtorRgjAXzHHHYVaRm2ZmqSzWtuPkIRh9719vaqekKiXhlmyZMccdM1oapeZXyl5J7VFYwYG4jk1g6S9rzt3N1VtS5ErGlMNygrznpUkMYhjxxnqTSwLx7CpJCMV0WOe5SupEQoHkCFs4ycfWsrWb63hNtP5aSyDJif7wX1rQ1RLaW0c3a5iQbsjqPpXAXUqbyIi4jydoY84/xp2uFzTg1lnvY3uhvDODux8y+gHtWleagGjXycl5OFBGMds1zVnZOxFxOpSEYI7Fz2A/xrodMtWkk86Ucnp6D2qJdkUjQ0uzESBm5c8kmtXIUVEo2qAKHbihKwhsjknFMWPJyal8llQOwwG6U4ECmAKuKcRyKbkHpSufyoAf2pveori5ht4zJPKkSDuxwKjtNQtbyMvbTpKB1weRSAtHiimghu+aKAL5k8sEPyR0PrWdcz5JOasuCy4zisy4hlDcqSPUc1ZJBI+7JPSsDUHe4kxDxEOuP4q2721naMIFIU/eqCGyKgAis5XZonYrabFtxuWt+FF2jiqUUPltwOK1LWPzCAOnUmmiWyeCEH5iPlH61FqN4sEJJPQdKsXEqwx4HAFcrd3DXl4FHKKabdkEVdl60iM7ebJ1POK0gUiUb2CLkDJqC2GIwKqX7mZ1jTkKecdzWFWp7KHMtzenT9pO3Q6EACMbeRVF5W3nI2SHjaT8rfQ1QivGs4hg7kHVD2/wqwLqC+hbac+qnqKqnXjPTqTUoShr0JGl3JkqVPcGuX1XRIZLgTxOIY85kXtj1Fb0j8ViXc5uZ/KQ/u1PJ9TWjlYzSILO386XuUB4zXSW8YjQACqVlAEA4rTUcUkDF7UYyRTgKdiqJJozviMR79DVR0IJB6jrU44xipZI/NAdep6ijcCkvGKlPIFRvhCc9RQJBxSGcV4x065CtcIzPh85ZskKew9gawvDt29rqGCzHzsKeelel3dpb38QjuIxIoOQD61FBpFnbgCGBE+i0rFqWhNZy74ge9FWEjVBgCiggtZpwOKZ0p1WSDqGFQNCPSpyfWjPFAFYQZYYGc1aV4oUZEdS45bB5qrqN7Hp9sXP+sYfKPQetYKyyQxSXMxxPMOF/ur2FZudpcqNVTvHmZa1K7aeQwxE5Pp2plnZeXywp2lwqEMjnc7HJNaqgVVr6k3toircTeTHtT77cfSqyRyRkMoVyferV3aeaS6MQcf5NZ8NwY38ub5XB69jXDWvz+/8jvoJcnu79SvfSkyEMMD9azGmeOQPE5GD1FWtXuxPdHy+gG3Pr71lTyYTYO/WuNQc6jaO5NRhqa39qNcwGMDEnRmFS2UGDyKx9LjdrsBEZw3UAdPeuxtNPYAGQ49hXqwTtqeRV5U9AhXgYFWMgDrVuOFVUgDFVZ4wr8jIrexz3HId5wozUwhYYzxmprcII8KAAKV2BBFOwrjREoGep96cXUDjpVWW7VAd5AI61g32sHeVgYEevpSbSGk2aGqTqsilT161TFwT0rPjaSdtzEk1cMBMTAEgkYzWd7l2sSnVIILgRSswYjOcZA7cmtGKZZVBRsiuOaxeAFrt5WdhsLM2VI7fSrWjPPFIUVn2Z6Mc4qVP3rWLcFa6Z1gopkZyBRVmRaJpu6hmpm4GrJJAc9alRNxzjIFQxkEgCg6halJkhmR2hO2QKeh9KB2e5ztyZbi+e4vF2wx87WGMt6fQVGiPey72B29qdLI+qXpGT5KHn/aNbMESRqAABisoQ5TWdRyG20ARQKtbaAQKduHFaGQBOKq3umxXYJ+5L2Yf1q2Gpk06xMqkMzvnYijJbHWpnCM1aSLhKUXeLOUm0a7ilKum4H+MdMUg0eFrpEleQliBsRcsfc/3R9a6cw3M0y+bKIoyv+pjPzn3Lf4fnU+xLOD9zCqjPIH8/esoUIU9jeeInUsirpVn9mtnEkEcGGbATnKjoT74q9byJMpKZwDjkYqrcySbd4JZY2yQvHHY1V83y5HSPcEkGQynjnoPb0qnU5XYhUuZX6myGXJ56dar3ShgSKrxXKuqSg53YRwpzg9qmeQYIrZSUloYOLi9StHeCLhzgDj8KhvNVihGNwzWfqEmBLjqBkVhxgu2TkmocraFKNy5eXsl5JxkL/OnW9pnBIp1rBkjitWCH2qbX3KvYS3tgo6VbEQ4yKkVQO1OPWqJuMESk8gHPrQltGn3UUfQVKvvThxTENUYNFLRSAsHHpSADHammlIwKskeu1ecVzZ0lraN4LNWVZW3PIx5atwk5pcMR14pNJ6lqTSaWzKFlYJbRhauiNcHrT8UDpQSN8odcmlWLJAyaXtSq3zAjpmmImEYXAAqteaet3NaSlyht5N4xxn2zWgwAUEVVWcmQg/THvTauNOxG9oBdGYZLv8AKSTwg/z/ADpW3maQMcxOAAc9D3wK5LxB4juPP8i1LwKnJbox/wAKv6Bq5udKZ7h2kmicqx7kHkH/AD6VnzJuxq4yUeYuyTbonhkIGDsb29D+BrOlmYQNEdglhyQoBbAzz+Pei+1Gza5UrOGdhtaNOSf/AK9LPqCQoFDYA4HOSaxdJt6m3tUkrI0I7gRwAsgjY8sBjk+pxVK61IJ/FismW9mlYbFIUnknrV1NM4WRiXzzmtb2WhzvV3ZVmnkuSQqkBupPepbazIwTV6K1CnpVlYsAClbuFyK3iCmrqDFCxAetSCMA4zVCFA70484o2jjmn7B60xDRTqNo9aMehoAaTRShfeigCYDmo5Hz0okbjiowCTzzTEOHanjp1pnAGKXOen50xCk4FNL9qDzSbaAAtQH5pCOKRVwaALQkzGOenFUbhsvkNj/GpzyCAazpobqSQqqgD+9nincDB8UWaTSfbEzkLtZUHfPU1g28ExhdFLLHIRuHY46V3i6aAMyuXf8ASqz6am44FR5l8zatfQ5i308KQQCSOhrUhsCSCRWtFZBccVaSEDjFK19wuUIrIAdK1rSMeV5Z7dKRY+1TxDDDFOwiq8exs+lMLfP16VduYwUYetZLtsc560noNGkmNmaX0NRxSAxg460/cSOlAh5PynHali+ZajJIWlhYgkdqYEu0UxmH0qRulV2yD70AOUjpRSLnrRQMk4AOfWgMccDFFFMkTvzTicUUUxCHpQTxmiigBCaYOTRRQMlxgUgPNFFAhDyaaUoopDE2c04L3oooATvUqcGiigCSUfKDWXfQ8bxxRRSY0QW020hWNXwcgc0UUkNjyM01WO/2oopiJ92RUUvHNFFADUPXiiiigZ//2Q==",
  "plan4": "data:image/jpeg;base64,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",
};

const PET_TYPES = [
  { id: "cat",  label: "貓咪" },
  { id: "dog",  label: "狗狗" },
  { id: "both", label: "都有" },
];

const C = {
  bg: "#3B2FA0",
  bgDeep: "#2A1F80",
  bgCard: "#4A3DB5",
  bgInput: "#3A32A8",
  border: "#5A4EC8",
  lime: "#D8F382",
  white: "#FFFFFF",
  muted: "#9890D8",
  mutedDim: "#7068B8",
  text: "#EDE8FF",
};

const font = "'Nunito', 'Noto Sans TC', sans-serif";
function esc(s) { return String(s ?? ""); }

function PetLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <ellipse cx="20" cy="36" rx="13" ry="11" fill="#D8F382" />
      <polygon points="10,28 14,18 18,28" fill="#D8F382" />
      <polygon points="22,28 26,18 30,28" fill="#D8F382" />
      <circle cx="17" cy="36" r="2" fill="#2A1F80" />
      <circle cx="23" cy="36" r="2" fill="#2A1F80" />
      <ellipse cx="20" cy="40" rx="3" ry="2" fill="#2A1F80" opacity="0.5" />
      <ellipse cx="44" cy="36" rx="13" ry="11" fill="white" opacity="0.9" />
      <ellipse cx="36" cy="30" rx="5" ry="7" fill="white" opacity="0.9" />
      <ellipse cx="52" cy="30" rx="5" ry="7" fill="white" opacity="0.9" />
      <circle cx="41" cy="36" r="2" fill="#2A1F80" />
      <circle cx="47" cy="36" r="2" fill="#2A1F80" />
      <ellipse cx="44" cy="40" rx="4" ry="2.5" fill="#2A1F80" opacity="0.4" />
    </svg>
  );
}

function PawPrint({ size = 20, color = "#D8F382", angle = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color}
      style={{ transform: `rotate(${angle}deg)`, display: "block" }}>
      <ellipse cx="32" cy="42" rx="14" ry="11" />
      <ellipse cx="14" cy="28" rx="6" ry="8" />
      <ellipse cx="26" cy="22" rx="6" ry="8" />
      <ellipse cx="38" cy="22" rx="6" ry="8" />
      <ellipse cx="50" cy="28" rx="6" ry="8" />
    </svg>
  );
}

function CatIcon({ size = 36, color = "#D8F382" }) {
  const s = 1.8;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* left ear — angled lines only, no head */}
      <path d="M22,38 Q20,28 24,22 L28,28" stroke={color} strokeWidth={s} />
      <line x1="23" y1="26" x2="27" y2="24" stroke={color} strokeWidth={s} />
      {/* right ear */}
      <path d="M42,38 Q44,28 40,22 L36,28" stroke={color} strokeWidth={s} />
      <line x1="41" y1="26" x2="37" y2="24" stroke={color} strokeWidth={s} />
      {/* heart nose */}
      <path d="M30.5,44 Q32,42 33.5,44 Q32,46 30.5,44 Z" stroke={color} strokeWidth={1.4} fill="none" />
      {/* whiskers left */}
      <line x1="10" y1="43" x2="26" y2="44.5" stroke={color} strokeWidth={s} />
      <line x1="10" y1="47" x2="26" y2="46.5" stroke={color} strokeWidth={s} />
      <line x1="12" y1="51" x2="27" y2="49" stroke={color} strokeWidth={s} />
      {/* whiskers right */}
      <line x1="54" y1="43" x2="38" y2="44.5" stroke={color} strokeWidth={s} />
      <line x1="54" y1="47" x2="38" y2="46.5" stroke={color} strokeWidth={s} />
      <line x1="52" y1="51" x2="37" y2="49" stroke={color} strokeWidth={s} />
    </svg>
  );
}

function DogIcon({ size = 36, color = "#D8F382" }) {
  const s = 1.8;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* left floppy ear — drooping down */}
      <path d="M20,18 Q10,22 12,38 Q14,44 20,42 Q22,34 18,24" stroke={color} strokeWidth={s} />
      {/* right ear — perky up */}
      <path d="M38,20 Q46,14 48,24 Q46,30 40,28" stroke={color} strokeWidth={s} />
      {/* heart nose */}
      <path d="M30,44 Q32,42 34,44 Q32,47 30,44 Z" stroke={color} strokeWidth={1.4} fill="none" />
    </svg>
  );
}

function BothIcon({ size = 36, color = "#D8F382" }) {
  const s = 1.6;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* cat ears left side */}
      <path d="M12,36 Q10,27 14,21 L18,27" stroke={color} strokeWidth={s} />
      <line x1="13" y1="25" x2="17" y2="23" stroke={color} strokeWidth={s} />
      <path d="M26,36 Q28,27 24,21 L20,27" stroke={color} strokeWidth={s} />
      <line x1="25" y1="25" x2="21" y2="23" stroke={color} strokeWidth={s} />
      {/* cat heart nose */}
      <path d="M17.5,41 Q19,39.5 20.5,41 Q19,43 17.5,41 Z" stroke={color} strokeWidth={1.2} fill="none" />
      {/* cat whiskers */}
      <line x1="4" y1="40" x2="15" y2="41" stroke={color} strokeWidth={s} />
      <line x1="4" y1="43" x2="15" y2="43" stroke={color} strokeWidth={s} />
      <line x1="23" y1="41" x2="32" y2="40" stroke={color} strokeWidth={s} />
      <line x1="23" y1="43" x2="32" y2="43" stroke={color} strokeWidth={s} />

      {/* dog floppy ear right side */}
      <path d="M38,20 Q30,24 32,38 Q34,43 39,41 Q40,34 37,26" stroke={color} strokeWidth={s} />
      {/* dog perky ear */}
      <path d="M52,18 Q60,13 61,23 Q59,29 54,27" stroke={color} strokeWidth={s} />
      {/* dog heart nose */}
      <path d="M44,43 Q46,41 48,43 Q46,46 44,43 Z" stroke={color} strokeWidth={1.2} fill="none" />
    </svg>
  );
}

export default function App() {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("register");
  const [form, setForm] = useState({ type: "general", petType: "", plan: "", team: "", name: "", groupName: "", ig: "", phone: "", address: "" });
  const [planModal, setPlanModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [exportUnlocked, setExportUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const exportExcel = () => {
    // Build CSV with BOM for Excel compatibility
    const headers = ["編號", "類型", "組別", "姓名", "團購名稱", "Instagram", "我養的是", "公關品方案", "聯絡電話", "收件地址", "登記時間"];
    const planName = { "1": "From Halla 肉泥", "2": "漢方潔牙棒", "3": "RESPET 口腔系列", "4": "保健肉丁" };
    const petName  = { "cat": "貓咪", "dog": "狗狗", "both": "都有" };
    const rows = regs.map((r, i) => [
      i + 1,
      r.type === "reels" ? "Reels 創作團購主" : "一般團購主",
      r.team + " 組",
      r.name,
      r.groupName,
      "@" + r.ig,
      r.petType ? (petName[r.petType] || "") : "",
      r.plan ? ("方案" + r.plan + "：" + (planName[r.plan] || "")) : "",
      r.phone || "",
      r.address || "",
      new Date(r.ts).toLocaleString("zh-TW"),
    ]);
    const csv = [headers, ...rows].map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `毛孩食務所_團購主名單_${new Date().toLocaleDateString("zh-TW").replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportReels = () => {
    const planName = { "1": "From Halla 肉泥", "2": "漢方潔牙棒", "3": "RESPET 口腔系列", "4": "保健肉丁" };
    const petName  = { "cat": "貓咪", "dog": "狗狗", "both": "都有" };
    const reelsOnly = regs.filter(r => r.type === "reels");
    const headers = ["編號", "組別", "姓名", "團購名稱", "Instagram", "我養的是", "公關品方案", "聯絡電話", "收件地址", "登記時間"];
    const rows = reelsOnly.map((r, i) => [
      i + 1,
      r.team + " 組",
      r.name,
      r.groupName,
      "@" + r.ig,
      r.petType ? (petName[r.petType] || "") : "",
      r.plan ? ("方案" + r.plan + "：" + (planName[r.plan] || "")) : "",
      r.phone || "",
      r.address || "",
      new Date(r.ts).toLocaleString("zh-TW"),
    ]);
    const csv = [headers, ...rows].map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `毛孩食務所_Reels創作者名單_${new Date().toLocaleDateString("zh-TW").replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const q = query(collection(db, "maohao_regs"), orderBy("ts", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegs(data);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!form.team || !form.name.trim() || !form.groupName.trim() || !form.ig.trim()) {
      setError("請填寫所有必填欄位"); return;
    }
    if (form.type === "reels" && (!form.petType || !form.plan)) {
      setError("Reels 團購主請選擇寵物類型及公關品方案"); return;
    }
    if (form.type === "reels" && (!form.phone.trim() || !form.address.trim())) {
      setError("Reels 團購主請填寫聯絡電話及收件地址"); return;
    }
    setError(""); setSubmitting(true);
    try {
      await addDoc(collection(db, "maohao_regs"), {
        type: form.type,
        petType: form.petType,
        plan: form.plan,
        team: form.team,
        name: form.name.trim(),
        groupName: form.groupName.trim(),
        ig: form.ig.trim().replace(/^@/, ""),
        phone: form.phone.trim(),
        address: form.address.trim(),
        ts: Date.now(),
      });
      setForm({ type: "general", petType: "", plan: "", team: "", name: "", groupName: "", ig: "", phone: "", address: "" });
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } catch { setError("儲存失敗，請再試一次"); }
    finally { setSubmitting(false); }
  };

  const filtered = filter === "all" ? regs : regs.filter(r => r.team === filter);
  const maxCount = Math.max(1, ...TEAMS.map(t => regs.filter(r => r.team === t).length));
  const sel = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const btnSt = (active, accent) => ({
    padding: "12px 8px", borderRadius: 10, border: "none", cursor: "pointer",
    fontFamily: font, fontSize: 13, fontWeight: 900,
    background: active ? (accent || C.lime) : C.bgInput,
    color: active ? (accent ? "#EDE8FF" : C.bgDeep) : C.muted,
    transition: "all 0.2s",
  });

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: font, color: C.text }}>

      {/* Topbar */}
      <div style={{ background: C.lime, overflow: "hidden", position: "relative" }}>

        {/* Giant background paw — decorative */}
        <div style={{
          position: "absolute", right: -20, top: -10, opacity: 0.12,
          transform: "rotate(20deg)",
        }}>
          <PawPrint size={160} color={C.bgDeep} />
        </div>

        {/* MY HOUSE label */}
        <div style={{
          padding: "10px 18px 0",
          fontSize: 9, fontWeight: 900, letterSpacing: "0.4em",
          color: C.bgDeep, opacity: 0.5, textTransform: "uppercase",
        }}>MY HOUSE × FORHAIRY</div>

        {/* Main title */}
        <div style={{ padding: "4px 18px 0", display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{
            fontSize: 36, fontWeight: 900, color: C.bgDeep,
            letterSpacing: "-0.02em", lineHeight: 1,
          }}>毛孩食務所</div>
          <PetLogo size={34} />
        </div>

        {/* Sub line */}
        <div style={{
          padding: "4px 18px 0",
          fontSize: 11, fontWeight: 900, color: C.bgDeep, opacity: 0.6,
          letterSpacing: "0.22em", textTransform: "uppercase",
        }}>GROUP BUY PLAN</div>

        {/* Bottom strip — dark bar with date + paws */}
        <div style={{
          background: C.bgDeep, marginTop: 12,
          padding: "7px 18px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <PawPrint size={10} color={C.lime} />
            <PawPrint size={13} color={C.lime} />
            <PawPrint size={10} color={C.lime} />
            <PawPrint size={13} color={C.lime} />
            <PawPrint size={10} color={C.lime} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 900, color: C.lime, letterSpacing: "0.2em" }}>
            5 / 9 — 5 / 22
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <PawPrint size={10} color={C.lime} />
            <PawPrint size={13} color={C.lime} />
            <PawPrint size={10} color={C.lime} />
            <PawPrint size={13} color={C.lime} />
            <PawPrint size={10} color={C.lime} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: C.bgDeep, display: "flex", borderBottom: `1px solid ${C.border}` }}>
        {[{ val: "register", label: "登記" }, { val: "stats", label: "即時統計" }].map(({ val, label }) => (
          <button key={val} onClick={() => setTab(val)} style={{
            flex: 1, padding: "13px 0", background: "transparent", border: "none",
            borderBottom: tab === val ? `3px solid ${C.lime}` : "3px solid transparent",
            color: tab === val ? C.lime : C.muted,
            fontFamily: font, fontSize: 12, fontWeight: 900, cursor: "pointer", letterSpacing: "0.08em",
          }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "24px 18px 80px" }}>

        {/* ── REGISTER ── */}
        {tab === "register" && (
          <div>
            <div style={{ background: C.bgCard, borderRadius: 18, padding: "22px 18px", border: `1px solid ${C.border}` }}>

              <div style={{ marginBottom: 22 }}>
                <label style={labelSt}>登記成為團購主</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <button style={btnSt(form.type === "general")} onClick={() => sel("type", "general")}>一般團購主</button>
                  <button style={btnSt(form.type === "reels")} onClick={() => sel("type", "reels")}>Reels 創作團購主</button>
                </div>
              </div>

              {form.type === "reels" && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelSt}>我養的是</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {PET_TYPES.map(({ id, label }) => {
                        const active = form.petType === id;
                        const iconColor = active ? C.lime : C.muted;
                        return (
                          <button key={id} onClick={() => sel("petType", id)} style={{
                            padding: "12px 4px 10px", borderRadius: 12, cursor: "pointer",
                            border: `1.5px solid ${active ? C.lime : C.border}`,
                            background: active ? "rgba(216,243,130,0.1)" : C.bgInput,
                            color: active ? C.lime : C.muted,
                            fontFamily: font, fontSize: 12, fontWeight: 800, transition: "all 0.2s",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                          }}>
                            {id === "cat"  && <CatIcon  size={34} color={iconColor} />}
                            {id === "dog"  && <DogIcon  size={34} color={iconColor} />}
                            {id === "both" && <BothIcon size={34} color={iconColor} />}
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={labelSt}>選擇公關品方案</label>
                    <button onClick={() => setPlanModal(true)} style={{
                      width: "100%", padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                      background: form.plan ? "rgba(216,243,130,0.08)" : C.bgInput,
                      border: `1.5px solid ${form.plan ? C.lime : C.border}`,
                      color: form.plan ? C.lime : C.muted,
                      fontFamily: font, fontSize: 13, fontWeight: 700,
                      textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span>{form.plan ? `方案${form.plan}：${PLANS.find(p => p.id === form.plan)?.name}` : "點擊查看並選擇方案 →"}</span>
                    </button>
                  </div>
                </>
              )}

              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>組別</label>
                <select value={form.team} onChange={e => sel("team", e.target.value)} style={inputSt}>
                  <option value="" disabled>選擇組別</option>
                  {TEAMS.map(t => <option key={t} value={t}>{t} 組</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>姓名</label>
                <input style={inputSt} placeholder="請輸入真實姓名" value={form.name} onChange={e => sel("name", e.target.value)} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>團購名稱</label>
                <input style={inputSt} placeholder="例：喬恩 × 毛孩食務所" value={form.groupName} onChange={e => sel("groupName", e.target.value)} />
              </div>

              <div style={{ marginBottom: form.type === "reels" ? 20 : 24 }}>
                <label style={labelSt}>Instagram</label>
                <input style={inputSt} placeholder="@username" value={form.ig} onChange={e => sel("ig", e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>

              {form.type === "reels" && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelSt}>聯絡電話</label>
                    <input style={inputSt} placeholder="09xxxxxxxx" value={form.phone} onChange={e => sel("phone", e.target.value)} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelSt}>宅配收件地址</label>
                    <input style={inputSt} placeholder="請輸入完整收件地址" value={form.address} onChange={e => sel("address", e.target.value)} />
                  </div>
                </>
              )}

              {error && (
                <div style={{ marginBottom: 14, padding: "10px 14px", background: "rgba(255,100,100,0.1)", border: "1px solid rgba(255,100,100,0.3)", borderRadius: 10, fontSize: 12, color: "#ffaaaa", fontWeight: 700 }}>{error}</div>
              )}

              <button onClick={handleSubmit} disabled={submitting} style={{
                width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                background: submitting ? C.mutedDim : C.lime,
                color: C.bgDeep, fontFamily: font, fontSize: 14, fontWeight: 900,
                letterSpacing: "0.08em", cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.2s",
              }}>
                {submitting ? "登記中…" : "確認登記"}
              </button>

              {success && (
                <div style={{ marginTop: 12, padding: "11px 14px", background: "rgba(216,243,130,0.08)", border: `1px solid ${C.lime}`, borderRadius: 10, fontSize: 13, color: C.lime, fontWeight: 800, textAlign: "center" }}>
                  登記成功，已同步至統計
                </div>
              )}
            </div>

            {/* Income info */}
            <div style={{ marginTop: 16, background: C.bgCard, borderRadius: 14, padding: "16px 18px", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, letterSpacing: "0.14em", marginBottom: 14 }}>收益說明</div>
              {[
                ["IBV 回饋", "33%", "由美安 / 品牌結算"],
                ["前端利潤", "3%", "總業績 3%，由品牌結算至 MY HOUSE"],
                ["現金回饋", "15%", "由美安 / 品牌結算"],
              ].map(([label, pct, note]) => (
                <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: C.muted, minWidth: 60, fontWeight: 700 }}>{label}</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: C.lime, lineHeight: 1 }}>{pct}</span>
                  <span style={{ fontSize: 10, color: C.mutedDim }}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div>
            {loading ? (
              <p style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 40 }}>載入中…</p>
            ) : (
              <>
                {/* Export button — password protected */}
                {!exportUnlocked ? (
                  <div style={{ marginBottom: 16, background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                    <div style={{ padding: "12px 14px 10px", fontSize: 11, color: C.muted, fontWeight: 800, letterSpacing: "0.1em" }}>匯出名單（需要密碼）</div>
                    <div style={{ display: "flex", gap: 8, padding: "0 14px 14px" }}>
                      <input
                        type="password"
                        placeholder="輸入密碼"
                        value={pwInput}
                        onChange={e => { setPwInput(e.target.value); setPwError(false); }}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            if (pwInput === "annakuooo") { setExportUnlocked(true); setPwError(false); }
                            else { setPwError(true); }
                          }
                        }}
                        style={{ ...inputSt, flex: 1, marginBottom: 0, borderColor: pwError ? "#ff6666" : "#5A4EC8" }}
                      />
                      <button onClick={() => {
                        if (pwInput === "annakuooo") { setExportUnlocked(true); setPwError(false); }
                        else { setPwError(true); }
                      }} style={{
                        padding: "0 16px", borderRadius: 10, border: "none",
                        background: C.lime, color: C.bgDeep,
                        fontFamily: font, fontSize: 12, fontWeight: 900, cursor: "pointer",
                      }}>確認</button>
                    </div>
                    {pwError && <div style={{ padding: "0 14px 12px", fontSize: 11, color: "#ff8888", fontWeight: 700 }}>密碼錯誤</div>}
                  </div>
                ) : (
                  <button onClick={exportExcel} style={{
                    width: "100%", padding: "14px", marginBottom: 16,
                    borderRadius: 12, border: `1.5px solid ${C.lime}`,
                    background: "rgba(216,243,130,0.08)",
                    color: C.lime, fontFamily: font, fontSize: 13, fontWeight: 900,
                    letterSpacing: "0.06em", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    匯出 Excel 名單
                  </button>
                )}

                {/* Reels only export button */}
                {exportUnlocked && (
                  <button onClick={exportReels} style={{
                    width: "100%", padding: "12px", marginBottom: 16,
                    borderRadius: 12, border: `1.5px solid #A890F0`,
                    background: "rgba(168,144,240,0.08)",
                    color: "#A890F0", fontFamily: font, fontSize: 12, fontWeight: 900,
                    letterSpacing: "0.06em", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    只匯出 Reels 創作者名單
                  </button>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                  {[
                    { label: "總登記人數", val: regs.length },
                    { label: "Reels 創作", val: regs.filter(r => r.type === "reels").length },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ background: C.bgCard, borderRadius: 14, padding: "18px", border: `1px solid ${C.border}`, textAlign: "center" }}>
                      <div style={{ fontSize: 40, fontWeight: 900, color: C.lime, lineHeight: 1 }}>{val}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 8, fontWeight: 800, letterSpacing: "0.1em" }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ background: C.bgCard, borderRadius: 16, padding: "18px 16px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, letterSpacing: "0.14em", marginBottom: 18 }}>各組統計</div>
                  {TEAMS.map(t => {
                    const count = regs.filter(r => r.team === t).length;
                    const reelsC = regs.filter(r => r.team === t && r.type === "reels").length;
                    return (
                      <div key={t} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 7 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: C.lime }}>{t} 組</span>
                            <span style={{ fontSize: 10, color: C.mutedDim }}>Reels {reelsC}</span>
                          </div>
                          <span style={{ fontSize: 24, fontWeight: 900, color: C.lime }}>{count}</span>
                        </div>
                        <div style={{ height: 7, background: C.bgInput, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.round(count / maxCount * 100)}%`, background: C.lime, borderRadius: 4, transition: "width 0.5s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: C.bgCard, borderRadius: 16, padding: "18px 16px", border: `1px solid ${C.border}`, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 800, letterSpacing: "0.14em", marginBottom: 16 }}>公關品方案統計</div>
                  {PLANS.map(p => {
                    const count = regs.filter(r => r.plan === p.id).length;
                    const total = Math.max(1, regs.filter(r => r.type === "reels").length);
                    return (
                      <div key={p.id} style={{ marginBottom: 13 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>方案{p.id}：{p.name}</span>
                          <span style={{ fontSize: 14, fontWeight: 900, color: C.lime }}>{count}</span>
                        </div>
                        <div style={{ height: 5, background: C.bgInput, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${count / total * 100}%`, background: "#A890F0", borderRadius: 3, transition: "width 0.5s" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: C.muted, fontWeight: 800, letterSpacing: "0.14em" }}>已登記名單</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["all", ...TEAMS].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                          padding: "4px 10px", borderRadius: 20, border: "none", cursor: "pointer",
                          background: filter === f ? C.lime : C.bgInput,
                          color: filter === f ? C.bgDeep : C.muted,
                          fontFamily: font, fontSize: 10, fontWeight: 800, transition: "all 0.15s",
                        }}>{f === "all" ? "全部" : f}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ maxHeight: 360, overflowY: "auto" }}>
                    {filtered.length === 0 ? (
                      <div style={{ padding: "32px", textAlign: "center", fontSize: 12, color: C.mutedDim }}>尚無登記</div>
                    ) : (
                      [...filtered].reverse().map(r => (
                        <div key={r.id} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bgInput, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 900, color: C.lime }}>{esc(r.team)}</div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: C.lime, display: "flex", alignItems: "center", gap: 6 }}>
                              {esc(r.name)}
                              {r.type === "reels" && <span style={{ fontSize: 9, background: "#5A4EC8", color: C.lime, padding: "2px 7px", borderRadius: 20, fontWeight: 800 }}>Reels</span>}
                            </div>
                            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>@{esc(r.ig)}</div>
                            <div style={{ fontSize: 10, color: C.mutedDim, marginTop: 1 }}>{esc(r.groupName)}</div>

                          </div>
                          {r.plan && <div style={{ fontSize: 9, color: C.muted, background: C.bgInput, padding: "4px 8px", borderRadius: 20, fontWeight: 700 }}>方案{r.plan}</div>}
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ padding: "11px 16px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: C.mutedDim, fontWeight: 700 }}>顯示 {filtered.length} 筆</span>
                    <span style={{ fontSize: 10, color: C.lime, fontWeight: 700 }}>● 即時同步</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Plan modal */}
      {planModal && (
        <div onClick={() => setPlanModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(20,12,60,0.92)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: C.bgCard, borderRadius: "24px 24px 0 0",
            padding: "20px 16px 44px", width: "100%", maxWidth: 560,
            margin: "0 auto", border: `1px solid ${C.border}`,
            maxHeight: "92vh", overflowY: "auto",
          }}>
            {/* Handle bar */}
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 18px" }} />

            <div style={{ fontSize: 14, fontWeight: 900, color: C.lime, marginBottom: 4, textAlign: "center", letterSpacing: "0.06em" }}>選擇公關品方案</div>
            <div style={{ fontSize: 11, color: C.muted, textAlign: "center", marginBottom: 18, fontWeight: 700 }}>點選方案查看內容，再確認選擇</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              {PLANS.map(p => {
                const imgKey = `plan${p.id}`;
                const isSelected = form.plan === p.id;
                return (
                  <button key={p.id} onClick={() => { sel("plan", p.id); setPlanModal(false); }} style={{
                    display: "flex", alignItems: "stretch",
                    padding: 0, borderRadius: 16, border: `2px solid ${isSelected ? C.lime : C.border}`,
                    background: isSelected ? "rgba(216,243,130,0.06)" : C.bgInput,
                    cursor: "pointer", overflow: "hidden", transition: "all 0.2s",
                    position: "relative", textAlign: "left",
                  }}>
                    {/* Selected indicator */}
                    {isSelected && (
                      <div style={{
                        position: "absolute", top: 10, right: 10, zIndex: 2,
                        width: 22, height: 22, borderRadius: "50%",
                        background: C.lime, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 900, color: C.bgDeep,
                      }}>✓</div>
                    )}
                    {/* Product image - square left column */}
                    <div style={{ width: 110, minWidth: 110, overflow: "hidden", background: C.bgDeep, flexShrink: 0 }}>
                      <img
                        src={PLAN_IMAGES[imgKey]}
                        alt={p.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                    {/* Info - right column */}
                    <div style={{ padding: "14px 14px 14px 14px", flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 9, background: isSelected ? C.lime : C.border, color: isSelected ? C.bgDeep : C.muted, padding: "2px 8px", borderRadius: 20, fontWeight: 900, letterSpacing: "0.1em" }}>方案 {p.id}</span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: isSelected ? C.lime : C.text }}>{p.name}</span>
                      </div>
                      <div style={{ fontSize: 10, color: isSelected ? C.lime : C.muted, fontWeight: 700, marginBottom: 8, opacity: 0.8 }}>{p.sub}</div>
                      {/* Tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                        {p.tags.map(t => (
                          <span key={t} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 20, background: "rgba(216,243,130,0.1)", color: C.lime, fontWeight: 800, border: `1px solid rgba(216,243,130,0.2)` }}>{t}</span>
                        ))}
                      </div>
                      {/* Points */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {p.points.map((pt, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                            <span style={{ color: C.lime, fontSize: 9, marginTop: 1, flexShrink: 0 }}>▸</span>
                            <span style={{ fontSize: 10, color: C.muted, lineHeight: 1.5, fontWeight: 600 }}>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setPlanModal(false)} style={{
              width: "100%", padding: "13px", borderRadius: 12, border: "none",
              background: C.bgInput, color: C.muted,
              fontFamily: font, fontSize: 12, fontWeight: 800, cursor: "pointer",
            }}>
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const labelSt = {
  display: "block", fontSize: 11, fontWeight: 800,
  letterSpacing: "0.1em", color: "#9890D8", marginBottom: 9,
};

const inputSt = {
  width: "100%", padding: "11px 14px",
  background: "#3A32A8", border: "1.5px solid #5A4EC8",
  borderRadius: 10, fontFamily: "'Nunito', 'Noto Sans TC', sans-serif",
  fontSize: 14, fontWeight: 700, color: "#D8F382", outline: "none",
  boxSizing: "border-box", appearance: "none",
};
