import { FilmStatus, AgeRating } from './create-ghibli.dto';

export interface Ghibli {
  id: number;
  title: string;
  originalTitle: string;
  director: string;
  releaseDate: Date;
  year: number;
  duration: number;
  genres: string[];
  ageRating: AgeRating;
  rating: number;
  status: FilmStatus;
  boxOffice: number;
  mainCharacters: string[];
  synopsis: string;
  availableLanguages: string[];
}
