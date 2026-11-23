export type Media = {
  id: string;
  kind: 'image' | 'video';
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  /** Focal point (0–1), used as object-position when the photo is cropped. */
  focalX: number;
  focalY: number;
  /** Dominant colour, painted behind the photo while it loads. */
  color: string;
  poster?: Media;
};

export type Puppy = {
  id: string;
  slug: string;
  /** Empty when the puppy has no name of its own and is listed by breed. */
  name: string;
  displayName: string;
  breed: string;
  gender: 'male' | 'female' | 'male-female' | '';
  genderLabel: string;
  age: string;
  colour: string;
  status: 'available' | 'reserved' | 'rehomed';
  origin: 'local' | 'imported';
  collections: string[];
  breeds: string[];
  cover: Media;
  media: Media[];
};

export type Faq = { id: string; question: string; answer: string };
export type Testimonial = { quote: string; author: string; location: string };
