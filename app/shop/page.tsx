"use client";
import { useState, useEffect, useRef } from "react";
import CountryCard from "@/components/CountryCard";

const ALL_COUNTRIES = [
  
  { code: "CN", name: "Хятад", flag: "", fromPrice: 0, region: "Ази" },
  { code: "SG", name: "Сингапур", flag: "", fromPrice: 0, region: "Ази" },
  { code: "JP", name: "Япон", flag: "", fromPrice: 0, region: "Ази" },
  { code: "KR", name: "Солонгос", flag: "", fromPrice: 0, region: "Ази" },
  { code: "US", name: "АНУ", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "AU", name: "Австрали", flag: "", fromPrice: 0, region: "Австрали" },
  { code: "GB", name: "Их Британи", flag: "", fromPrice: 0, region: "Европ" },
  { code: "FR", name: "Франц", flag: "", fromPrice: 0, region: "Европ" },
  { code: "IT", name: "Итали", flag: "", fromPrice: 0, region: "Европ" },
  { code: "ES", name: "Испани", flag: "", fromPrice: 0, region: "Европ" },
  { code: "TR", name: "Турк", flag: "", fromPrice: 0, region: "Европ" },
  { code: "HK", name: "Хонг Конг", flag: "", fromPrice: 0, region: "Ази" },
  { code: "TH", name: "Тайланд", flag: "", fromPrice: 0, region: "Ази" },
  { code: "DE", name: "Герман", flag: "", fromPrice: 0, region: "Европ" },
  { code: "PT", name: "Португал", flag: "", fromPrice: 0, region: "Европ" },
  { code: "MY", name: "Малайз", flag: "", fromPrice: 0, region: "Ази" },
  { code: "VN", name: "Вьетнам", flag: "", fromPrice: 0, region: "Ази" },
  { code: "ID", name: "Индонез", flag: "", fromPrice: 0, region: "Ази" },
  { code: "PH", name: "Филиппин", flag: "", fromPrice: 0, region: "Ази" },
  { code: "IN", name: "Энэтхэг", flag: "", fromPrice: 0, region: "Ази" },
  { code: "CA", name: "Канада", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "MX", name: "Мексик", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "SA", name: "Саудын Араб", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "AE", name: "АНЭУ", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "EG", name: "Египет", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "RU", name: "Орос", flag: "", fromPrice: 0, region: "Европ" },
  { code: "MO", name: "Макао", flag: "", fromPrice: 0, region: "Ази" },
  { code: "NZ", name: "Шилэнз", flag: "", fromPrice: 0, region: "Австрали" },
  { code: "AR", name: "Аргентина", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "BR", name: "Бразилия", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "PE", name: "Перу", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "CH", name: "Швейцария", flag: "", fromPrice: 0, region: "Европ" },
  { code: "AT", name: "Австрия", flag: "", fromPrice: 0, region: "Европ" },
  { code: "NL", name: "Голланд", flag: "", fromPrice: 0, region: "Европ" },
  { code: "BE", name: "Бельги", flag: "", fromPrice: 0, region: "Европ" },
  { code: "AZ", name: "Азербайджан", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "AL", name: "Албани", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "RE", name: "Реюньон", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "DZ", name: "Алжир", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "LK", name: "Шри-Ланка", flag: "", fromPrice: 0, region: "Ази" },
  { code: "JO", name: "Йордон", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "TN", name: "Тунис", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "KZ", name: "Қазақстан", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "UZ", name: "Узбекистан", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "MA", name: "Марокко", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "PK", name: "Пакистан", flag: "", fromPrice: 0, region: "Ази" },
  { code: "AM", name: "Армений", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "KH", name: "Камбоджа", flag: "", fromPrice: 0, region: "Ази" },
  { code: "GR", name: "Греци", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "RS", name: "Серби", flag: "", fromPrice: 0, region: "Европ" },
  { code: "UA", name: "Украин", flag: "", fromPrice: 0, region: "Европ" },
  { code: "MD", name: "Молдави", flag: "", fromPrice: 0, region: "Европ" },
  { code: "FI", name: "Финланд", flag: "", fromPrice: 0, region: "Европ" },
  { code: "PL", name: "Польш", flag: "", fromPrice: 0, region: "Европ" },
  { code: "NO", name: "Норвег", flag: "", fromPrice: 0, region: "Европ" },
  { code: "RO", name: "Румын", flag: "", fromPrice: 0, region: "Европ" },
  { code: "JE", name: "Джерси", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "QA", name: "Катар", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "KE", name: "Кения", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "NG", name: "Наигерия", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "SE", name: "Швеция", flag: "", fromPrice: 0, region: "Европ" },
  { code: "IE", name: "Ирланд", flag: "", fromPrice: 0, region: "Европ" },
  { code: "HU", name: "Венгр", flag: "", fromPrice: 0, region: "Европ" },
  { code: "CY", name: "Кипр", flag: "", fromPrice: 0, region: "Европ" },
  { code: "BG", name: "Болгар", flag: "", fromPrice: 0, region: "Европ" },
  { code: "CZ", name: "Чех", flag: "", fromPrice: 0, region: "Европ" },
  { code: "DK", name: "Датиланд", flag: "", fromPrice: 0, region: "Европ" },
  { code: "HR", name: "Хорватия", flag: "", fromPrice: 0, region: "Европ" },
  { code: "EE", name: "Эстони", flag: "", fromPrice: 0, region: "Европ" },
  { code: "ME", name: "Черногория", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "SI", name: "Словения", flag: "", fromPrice: 0, region: "Европ" },
  { code: "LT", name: "Литва", flag: "", fromPrice: 0, region: "Европ" },
  { code: "KG", name: "Кыргызстан", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "LU", name: "Люксембург", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "BD", name: "Бангладеш", flag: "", fromPrice: 0, region: "Ази" },
  { code: "PY", name: "Парагвай", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "GE", name: "Грузи", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "CO", name: "Колумбия", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "GT", name: "Гватемала", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "HN", name: "Гондурас", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "NI", name: "Никарагуа", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "PA", name: "Панама", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "CL", name: "Чили", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "SV", name: "Сальвадор", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "DO", name: "Доминикан", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "MT", name: "Мальта", flag: "", fromPrice: 0, region: "Европ" },
  { code: "IM", name: "Мэн", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "UY", name: "Уругвай", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "BO", name: "Боливия", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "ZA", name: "Южно-Африк", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "TZ", name: "Танзания", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "SK", name: "Словакия", flag: "", fromPrice: 0, region: "Европ" },
  { code: "AX", name: "Аланд", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "GF", name: "Француз Гвиана", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "JM", name: "Ямайка", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "CR", name: "Костарика", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "LA", name: "Лаос", flag: "", fromPrice: 0, region: "Ази" },
  { code: "SN", name: "Сенегал", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "BA", name: "Босния", flag: "", fromPrice: 0, region: "Европ" },
  { code: "LV", name: "Латвия", flag: "", fromPrice: 0, region: "Европ" },
  { code: "OM", name: "Оман", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "IL", name: "Израил", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "IS", name: "Исланд", flag: "", fromPrice: 0, region: "Европ" },
  { code: "BH", name: "Бахрейн", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "IQ", name: "Ирак", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "MK", name: "Македония", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "BY", name: "Беларус", flag: "", fromPrice: 0, region: "Европ" },
  { code: "FO", name: "Фарер", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "AD", name: "Андорра", flag: "", fromPrice: 0, region: "Европ" },
  { code: "GH", name: "Гана", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "EC", name: "Эквадор", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "TJ", name: "Таджикистан", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "FJ", name: "Фиджи", flag: "", fromPrice: 0, region: "Австрали" },
  { code: "LI", name: "Лихтенштейн", flag: "", fromPrice: 0, region: "Европ" },
  { code: "CD", name: "Конго", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "GI", name: "Гибралтар", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "NP", name: "Непал", flag: "", fromPrice: 0, region: "Ази" },
  { code: "MZ", name: "Мозамбик", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "PR", name: "Пуэрто Рико", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "WS", name: "Самоа", flag: "", fromPrice: 0, region: "Австрали" },
  { code: "GU", name: "Гуам", flag: "", fromPrice: 0, region: "Австрали" },
  { code: "BT", name: "Бутан", flag: "", fromPrice: 0, region: "Ази" },
  { code: "MU", name: "Маврикий", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "SC", name: "Сейшел", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "TC", name: "Теркс", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "BW", name: "Ботсвана", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "AF", name: "Афганистан", flag: "", fromPrice: 0, region: "Ази" },
  { code: "GA", name: "Габон", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "ZM", name: "Замбия", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "UG", name: "Уганда", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "CM", name: "Камерун", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "GG", name: "Гернси", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "TD", name: "Чад", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "CG", name: "Конго", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "CW", name: "Кюрасао", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "MW", name: "Малави", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "GP", name: "Гваделупе", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "BB", name: "Барбадос", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "NE", name: "Нигер", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "BN", name: "Бруней", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "AI", name: "Ангуилла", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "BM", name: "Бермуд", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "DM", name: "Доминика", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "SR", name: "Суринам", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "BJ", name: "Бенин", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "GY", name: "Гайана", flag: "", fromPrice: 0, region: "Өмнөд Америк" },
  { code: "KY", name: "Кайман", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "BF", name: "Буркина-Фасо", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "GW", name: "Гвинея-Бисау", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "AG", name: "Антигуа", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "GD", name: "Гренада", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "LC", name: "Сент-Люсия", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "VG", name: "Виргин", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "KN", name: "Сент-Китс", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "MS", name: "Монтсеррат", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "SL", name: "Сьерра-Леоне", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "GN", name: "Гвинея", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "BS", name: "Багам", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "TT", name: "Тринидад", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "VC", name: "Сент-Винсент", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "CF", name: "Централ-Afрикий", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "LR", name: "Либерия", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "ML", name: "Мали", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "CI", name: "Кот-д’Ивоир", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "RW", name: "Руанда", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "SD", name: "Судан", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "GM", name: "Гамбия", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "BZ", name: "Белиз", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "CV", name: "Кабо-Верде", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "SZ", name: "Свазиленд", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "LY", name: "Ливия", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "GL", name: "Гренландия", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "MG", name: "Мадагаскар", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "AO", name: "Ангола", flag: "", fromPrice: 0, region: "Дундад зүүн" },
  { code: "MV", name: "Мальдив", flag: "", fromPrice: 0, region: "Бусад" },
  { code: "HT", name: "Гаити", flag: "", fromPrice: 0, region: "Хойд Америк" },
  { code: "MC", name: "Монако", flag: "", fromPrice: 0, region: "Европ" },
  { code: "PF", name: "Француз Полинезия", flag: "", fromPrice: 0, region: "Австрали" }
];

const REGION_ORDER = ["Ази", "Европ", "Хойд Америк", "Өмнөд Америк", "Австрали", "Дундад зүүн", "Монгол"];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [allCountry, setAllCountry] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [cardHeight, setCardHeight] = useState(0);
  const card = useRef<HTMLDivElement>(null)
  const grid = useRef(null)
useEffect(() => {
  const getColumnCount = (gridElement: HTMLElement) => {
  const computedStyle = getComputedStyle(gridElement);
  const gridTemplateColumns = computedStyle.gridTemplateColumns;
  const columns = gridTemplateColumns.split(' ').filter(col => col !== '');
  return columns.length;
};


  const updateHeight = () => {
    
    const column:number = grid.current? getColumnCount(grid.current) : 5;
    const row = Math.ceil(5/column);
    console.log(row);
    if(card.current?.clientHeight){

      setCardHeight(card.current?.clientHeight  * row + 20 * (row) || 0);
    }else{
      setCardHeight(0)
    }
  };
  
  updateHeight();
  
  window.addEventListener('resize', updateHeight);
  
  return () => {
    window.removeEventListener('resize', updateHeight);
  };
}, [card, allCountry]); 

useEffect(() => {
  fetch("/api/esim/list").then((res) => {

    res.json().then((r) => {
      console.log(r);
      setAllCountry(r);
      setFiltered(r);
    })
  })
}, [])
  useEffect(() => {
    const q = search.toLowerCase().trim();
    setFiltered(
      q
        ? allCountry.filter(
            (c:any) =>
              c.name.toLowerCase().includes(q) ||
              c.code.toLowerCase().includes(q)
          )
        : allCountry
    );
  }, [search]);

  const groupedByRegion = filtered.reduce((acc:any, country:any) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, typeof allCountry>);

  const sortedRegions = Object.keys(groupedByRegion).sort((a, b) => {
    const indexA = REGION_ORDER.indexOf(a);
    const indexB = REGION_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  return (
    <div style={{ paddingTop: "96px", minHeight: "100vh" }}>
      <div className="container">
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "14px",
            }}
          >
            eSIM <span className="gradient-text">дэлгүүр</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 17 }}>
            Очих улсаа хайж, өөрт тохирох багцаа сонгоно уу.
          </p>
        </div>

        <div style={{ position: "relative", maxWidth: 480, marginBottom: "48px" }}>
          <span
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 18,
              color: "var(--text-muted)",
            }}
          >
            🔍
          </span>
          <input
            id="country-search"
            type="text"
            placeholder="Улсаа хайх... (жишээ: Япон, JP)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: "48px" }}
          />
        </div>

        {search && (
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: "24px" }}>
            {filtered.length} үр дүн олдлоо
          </p>
        )}

        {filtered.length > 0 ? (
          <div>
            {sortedRegions.map((region) => {
              const countries = groupedByRegion[region];
              const isExpanded = expandedRegions[region] || false;
              const hasMore = countries.length > 5;
              
              const toggleExpand = () => {
                setExpandedRegions(prev => ({
                  ...prev,
                  [region]: !prev[region]
                }));
              };
              
              return (
                <div key={region} style={{ marginBottom: "48px" }}>
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "20px",
                      paddingBottom: "12px",
                      borderBottom: "1px solid var(--border)"
                    }}
                  >
                    {region}
                  </h2>
                  <div style={{ position: "relative" }}>
                    <div
                    ref={grid}
                      style={{
                        paddingTop:"10px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "16px",
                        maxHeight: isExpanded ? "2000px" :cardHeight +"px",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-in-out"
                      }}
                    >
                      {countries.map((c:typeof countries[0], index:number) => (
                        <div
                        ref={card}
                          key={c.code}
                          style={{
                            opacity: isExpanded || index < 5 ? 1 : 0,
                            transform: isExpanded || index < 5 ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.3s ease-out",
                            transitionDelay: isExpanded && index >= 5 ? `${(index - 4) * 0.05}s` : "0s"
                          }}
                        >
                          <CountryCard {...c} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {hasMore && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <button
                        onClick={toggleExpand}
                        style={{
                          background: "none",
                          border: "1px solid var(--border)",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          fontSize: "14px",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--text)";
                          e.currentTarget.style.borderColor = "var(--text)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.borderColor = "var(--border)";
                        }}
                      >
                        {isExpanded ? "Буцах" : "Дэлгэрэнгүй"}
                        <span style={{ transition: "transform 0.3s ease" }}>
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--text-muted)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: "16px" }}>🌐</div>
            <p style={{ fontSize: 18, fontWeight: 600, marginBottom: "8px" }}>
              Улс олдсонгүй
            </p>
            <p style={{ fontSize: 14 }}>Өөр нэрээр хайж үзнэ үү</p>
          </div>
        )}

        <div style={{ height: 80 }} />
      </div>
    </div>
  );
}
