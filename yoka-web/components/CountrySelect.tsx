import React, { useState, useEffect } from "react";

// 1. กำหนด Interface ตามโครงสร้างข้อมูลของ API
// หมายเหตุ: คุณอาจต้อง log ดู response จริงๆ ว่า field ชื่อว่าอะไร (เช่น name, countryName, alpha2Code ฯลฯ)
interface CountryData {
  name: string; // ปรับตาม API จริง เช่น country.name.common
  isoCode: string; // ปรับตาม API จริง เช่น country.cca2 หรือ country.alpha2Code
}

interface CountrySelectProps {
  onChange: (countryCode: string) => void;
  className?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  onChange,
  className,
}) => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // ใช้ API ที่คุณระบุ
        const response = await fetch("https://www.apicountries.com/countries");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // 2. Map ข้อมูลให้ตรงกับ Interface ของเรา
        // *สำคัญ* ต้องเช็ค console.log(data) เพื่อดูว่า API ส่งกลับมาเป็นแบบไหน
        // สมมติว่า API ส่งกลับมาเป็น Array ของ object ที่มี name และ code
        const formattedCountries: CountryData[] = data.map((item: any) => ({
          name: item.name, // หรือ item.name.common (ถ้าใช้ restcountries)
          isoCode: item.code, // หรือ item.cca2
        }));

        // เรียงลำดับตามตัวอักษรเพื่อความสวยงาม
        const sortedCountries = formattedCountries.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCountries(sortedCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("ไม่สามารถดึงข้อมูลประเทศได้");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  if (loading) return <div className="text-gray-500">Loading countries...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="country-select"
        className="text-sm font-medium text-gray-700"
      >
        เลือกประเทศ
      </label>
      <select
        id="country-select"
        className={`border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        defaultValue=""
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          -- กรุณาเลือก --
        </option>
        {countries.map((country) => (
          <option key={country.isoCode} value={country.isoCode}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelect;
