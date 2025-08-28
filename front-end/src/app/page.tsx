import CampaignDetails from "@/components/CampaignDetails";
import { promises as fs } from "fs";
import path from "path";

async function getData() {
  const campaignDir = path.join(process.cwd(), "public/campaign");
  const imageFiles = await fs.readdir(campaignDir);
  const images = imageFiles.map((file) => `/campaign/${file}`);

  return { images };
}

export default async function Home() {
  const { images } = await getData();

  return <CampaignDetails images={images} />;
}
