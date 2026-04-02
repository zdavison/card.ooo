import { renderCard } from "./index";

(globalThis as Record<string, unknown>).renderCard = renderCard;
