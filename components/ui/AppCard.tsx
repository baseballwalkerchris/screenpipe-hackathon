import Link from "next/link";
import Image from "next/image";

interface AppCardProps {
  title: string;
  embedUrl: string;
  expectedTime: string;
  compensation: string;
  projectId: string;
  coverPhoto?: string;
}

export function AppCard({ 
  title, 
  embedUrl, 
  expectedTime, 
  compensation, 
  projectId,
  coverPhoto
}: AppCardProps) {
  return (
    <Link href={`/user/${projectId}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* App Preview */}
        <div className="bg-[#FFB84C] aspect-[4/3] relative">
          <Image
            src={coverPhoto || "/appcard.png"}
            alt={title}
            fill
            className="object-cover"
          />
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-medium text-gray-900">
            {title}
          </h3>
          <div className="flex gap-4 text-sm text-gray-500">
            <p>Expected time: {expectedTime}</p>
            <p>Compensation: ${compensation}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 