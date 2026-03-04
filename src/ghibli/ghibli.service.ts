import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/storage/storage.service';
import { QueryGhibliDto } from './dto/query-ghibli.dto';
import { Ghibli } from './dto/ghibli.dto';
import { CreateGhibliDto } from './dto/create-ghibli.dto';
import { UpdateGhibliDto } from './dto/update-ghibli.dto';

@Injectable()
export class GhibliService {
  constructor(private readonly storage: StorageService) {}

  findAll(query: QueryGhibliDto) {
    let films = this.storage.read<Ghibli[]>('ghibli.json');

    if (query.genre) {
      films = films.filter((f) =>
        f.genres.some((g) =>
          g.toLowerCase().includes(query.genre!.toLowerCase()),
        ),
      );
    }
    if (query.status) {
      films = films.filter((f) => f.status === query.status);
    }
    if (query.language) {
      films = films.filter((f) =>
        f.availableLanguages.some(
          (l) => l.toLowerCase() === query.language!.toLowerCase(),
        ),
      );
    }

    if (query.sortBy) {
      films.sort((a, b) => {
        const fieldA = a[query.sortBy!];
        const fieldB = b[query.sortBy!];

        if (fieldA == null) return 1;
        if (fieldB == null) return -1;

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return query.sortOrder === 'desc'
            ? fieldB.localeCompare(fieldA)
            : fieldA.localeCompare(fieldB);
        }
        
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          return query.sortOrder === 'desc' ? fieldB - fieldA : fieldA - fieldB;
        }

        return 0;
      });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const start = (page - 1) * limit;

    return {
      data: films.slice(start, start + limit),
      total: films.length,
      page,
      limit,
    };
  }

  findOne(id: number): Ghibli {
    const film = this.storage
      .read<Ghibli[]>('ghibli.json')
      .find((f) => f.id === id);
    if (!film) throw new NotFoundException('Film non trouvé');
    return film;
  }

  search(q: string): Ghibli[] {
    const term = q.toLowerCase();
    const films = this.storage.read<Ghibli[]>('ghibli.json');
    
    const results = films.filter((film) => {
      return Object.values(film).some((value) => {
        if (value == null) return false;
        
        // Array search
        if (Array.isArray(value)) {
          return value.some((item) => 
            item?.toString().toLowerCase().includes(term)
          );
        }
        
        return value.toString().toLowerCase().includes(term);
      });
    });
    
    if (results.length === 0) {
      throw new NotFoundException('Aucun film trouvé correspondant à la recherche');
    }
    
    return results;
  }

  create(dto: CreateGhibliDto): Ghibli {
    const films = this.storage.read<Ghibli[]>('ghibli.json');

    if (films.some((f) => f.title.toLowerCase() === dto.title.toLowerCase())) {
      throw new ConflictException(
       'Titre déjà existant',
      );
    }

    const nextId = Math.max(...films.map((f) => f.id), 0) + 1;
    const newFilm: Ghibli = { id: nextId, ...dto };

    this.storage.write('ghibli.json', [...films, newFilm]);
    return newFilm;
  }

  replace(id: number, dto: CreateGhibliDto): Ghibli {
    const films = this.storage.read<Ghibli[]>('ghibli.json');
    const index = films.findIndex((f) => f.id === id);
    if (index === -1)
      throw new NotFoundException('Film non trouvé');

    const updated = { id, ...dto };
    films[index] = updated;
    this.storage.write('ghibli.json', films);
    return updated;
  }

  update(id: number, dto: UpdateGhibliDto): Ghibli {
    const films = this.storage.read<Ghibli[]>('ghibli.json');
    const index = films.findIndex((f) => f.id === id);
    if (index === -1)
      throw new NotFoundException('Film non trouvé');

    const updated = { ...films[index], ...dto };
    films[index] = updated;
    this.storage.write('ghibli.json', films);
    return updated;
  }

  remove(id: number): void {
    const films = this.storage.read<Ghibli[]>('ghibli.json');
    const index = films.findIndex((f) => f.id === id);
    if (index === -1)
      throw new NotFoundException('Film non trouvé');

    if (films[index].status === 'upcoming') {
      throw new ConflictException('Impossible de supprimer un film à venir');
    }

    films.splice(index, 1);
    this.storage.write('ghibli.json', films);
  }
}
