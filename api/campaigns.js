import campaignRoutes from "../routes/campaign.js";

export default function handler(req, res) {
  return campaignRoutes(req, res);
}
