export interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  coverImage: string;
}

export const ALBUMS: Album[] = [
  {
    id: "1",
    title: "Currents",
    artist: "Tame Impala",
    year: "2015",
    coverImage:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "After Hours",
    artist: "The Weeknd",
    year: "2020",
    coverImage:
      "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Random Access Memories",
    artist: "Daft Punk",
    year: "2013",
    coverImage:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Melodrama",
    artist: "Lorde",
    year: "2017",
    coverImage:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Blond",
    artist: "Frank Ocean",
    year: "2016",
    coverImage:
      "https://images.unsplash.com/photo-1542208998-f6dbbb27a72f?q=80&w=1000&auto=format&fit=crop",
  },
];
