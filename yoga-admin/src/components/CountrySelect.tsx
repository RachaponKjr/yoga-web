/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import countryList from "react-select-country-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
}

const CountrySelect = ({ value, onChange }: CountrySelectProps) => {
  const options = useMemo(() => countryList().getData(), []);
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="w-full h-11 rounded-xl bg-gray-50/50 border-gray-200 focus:ring-2 focus:ring-indigo-500/20 transition-all">
        <SelectValue placeholder="Select your country" />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {options.map((country: any) => (
          <SelectItem key={country.value} value={country.label}>
            {country.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
