import { useState } from "react";
import { Share2, Facebook, Twitter, Mail, Link2, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareProductProps {
  productTitle: string;
  productUrl?: string;
}

export function ShareProduct({ productTitle, productUrl }: ShareProductProps) {
  const [copied, setCopied] = useState(false);

  // Get current URL if not provided
  const shareUrl = productUrl || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(productTitle);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = (platform: string) => {
    let shareLink = "";

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "pinterest":
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
        break;
      case "email":
        shareLink = `mailto:?subject=${encodedTitle}&body=Check out this product: ${encodedUrl}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodedTitle} ${encodedUrl}`;
        break;
      default:
        return;
    }

    // BACKEND API PLACEHOLDER: Track share events
    // TODO: Implement POST /api/analytics/share with { productId, platform }
    console.log(`Shared on ${platform}:`, shareLink);

    // Open share link
    if (platform === "email") {
      window.location.href = shareLink;
    } else {
      window.open(shareLink, "_blank", "width=600,height=400");
    }
  };

  // Native Web Share API fallback
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          url: shareUrl,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-4 rounded-lg border-2 border-gray-700 text-white hover:border-gray-500 transition-colors"
          aria-label="Share product"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800 text-white" align="end">
        <div className="px-3 py-2 text-sm font-semibold">Share this product</div>
        <DropdownMenuSeparator className="bg-gray-800" />

        {/* Social Media Platforms */}
        <DropdownMenuItem
          onClick={() => handleShare("facebook")}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
        >
          <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center">
            <Facebook className="w-4 h-4 text-white fill-white" />
          </div>
          <span>Share on Facebook</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare("twitter")}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
        >
          <div className="w-8 h-8 bg-[#1DA1F2] rounded-full flex items-center justify-center">
            <Twitter className="w-4 h-4 text-white fill-white" />
          </div>
          <span>Share on Twitter</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare("pinterest")}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
        >
          <div className="w-8 h-8 bg-[#E60023] rounded-full flex items-center justify-center text-white">
            📌
          </div>
          <span>Pin on Pinterest</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare("whatsapp")}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
        >
          <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center text-white">
            💬
          </div>
          <span>Share on WhatsApp</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleShare("email")}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
        >
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <span>Share via Email</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-800" />

        {/* Copy Link */}
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
        >
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4 text-white" />}
          </div>
          <span>{copied ? "Link copied!" : "Copy link"}</span>
        </DropdownMenuItem>

        {/* Native Share API (if available) */}
        {typeof navigator !== "undefined" && navigator.share && (
          <>
            <DropdownMenuSeparator className="bg-gray-800" />
            <DropdownMenuItem
              onClick={handleNativeShare}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 focus:bg-gray-800 text-gray-300 hover:text-white"
            >
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <span>More options...</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// BACKEND API PLACEHOLDER: Share tracking
// TODO: Implement POST /api/analytics/share for tracking share events
// TODO: Add share count display feature
// TODO: Implement social media previews (Open Graph tags)
