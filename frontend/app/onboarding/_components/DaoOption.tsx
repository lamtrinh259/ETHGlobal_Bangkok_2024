"use client";

import { PersonIcon } from "@radix-ui/react-icons";

export type DaoOptionType = {
  iconUrl: string;
  title: string;
  tags: string[];
  totalMembers: string;
};

interface DaoOptionProps {
  iconUrl: string;
  title: string;
  tags: string[];
  totalMembers: string;
  isSelected: boolean;
  onSelect: (title: string) => void;
}

export default function DaoOption({
  iconUrl,
  title,
  tags,
  totalMembers,
  isSelected,
  onSelect,
}: DaoOptionProps) {
  return (
    <div
      className={`flex flex-col items-start justify-start p-4 border rounded-2xl cursor-pointer transition-shadow duration-300
        ${
          isSelected
            ? "border-violet-600 shadow-violet-600 shadow-md"
            : "border-black"
        }
        ${!isSelected && "hover:shadow-md hover:shadow-violet-600"}`}
      onClick={() => onSelect(title)}
    >
      <div className="avatar">
        <div className="w-12 mb-2 rounded-full">
          <img src={iconUrl} />
        </div>
      </div>
      <h2 className="font-bold text-lg">{title}</h2>
      <div className="flex flex-row gap-2">
        {tags.map((tag: string) => (
          <div
            className="text-xs border border-black px-2 py-1 rounded-2xl"
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-center items-center mt-4 text-sm">
        <PersonIcon className="size-sm mr-2" />
        <p>{totalMembers}</p>
      </div>
    </div>
  );
}
