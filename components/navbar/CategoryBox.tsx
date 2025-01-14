import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface CategoryBoxProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  onClick,
  label,
  selected,
}) => {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const lowerCaseLabel = label.toLowerCase();
    let url;

    if (
      lowerCaseLabel === "clubs" ||
      lowerCaseLabel === "events" ||
      lowerCaseLabel === "issues" ||
      lowerCaseLabel === "study-requests" ||
      lowerCaseLabel === "resources"
    ) {
      url = `/${lowerCaseLabel}`;
    } else if (lowerCaseLabel === "map") {
      url = "/MAP";
    } else if (lowerCaseLabel === "friends") {
      url = `/user/friends`;
    }
    else if (lowerCaseLabel === "home") {
      url = `/`;
    }

    if (url) {
      router.push(url);
    }
    onClick();
  }, [label, router, onClick]);

  return (
    <div
      onClick={handleClick}
      className={`
        flex
        flex-col
        items-center
        justify-center
        gap-2
        p-1
        border-b-2
        transition
        cursor-pointer
        ${selected ? "border-white text-white" : "border-transparent text-blue-500"}
        ${selected ? "" : "hover:text-gray-500"}
      `}
    >
      <div className="font-medium text-lg">{label}</div>
    </div>
  );
};

export default CategoryBox;
