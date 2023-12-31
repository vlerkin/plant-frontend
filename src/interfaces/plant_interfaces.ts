import { z } from "zod";

enum Light {
  fullSun = "full sun",
  partShad = "partial shadow",
  fullShad = "full shadow",
}

export const LightEnum = z.nativeEnum(Light);

enum Location {
  south = "south",
  north = "north",
  east = "east",
  west = "west",
  southEast = "south_east",
  southWest = "south_west",
  northEast = "north_east",
  northWest = "north_west",
}

export const LocationEnum = z.nativeEnum(Location);

export interface UploadResults {
  filename: string;
  user_id: number;
}

enum Disease {
  rottenRoot = "Rotten root",
  fungalLeafSpots = "Fungal leaf spots",
  bacterialLeafSpots = "Bacterial leaf spots",
  blackSootyMold = "Black sooty mold",
  powderyMildew = "Powdery mildew",
  grayMold = "Gray mold/ Botrytis blight",
  whiteMold = "White mold",
  anthracnose = "Anthracnose",
  viralDisease = "Viral disease",
}

export const DiseasEnum = z.nativeEnum(Disease);
