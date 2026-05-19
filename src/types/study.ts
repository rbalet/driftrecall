export interface StudyCardModel {
  id: string;
  front: string;
  back: string;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  cards: StudyCardModel[];
}

export interface StudySettings {
  revealDelaySeconds: number;
  autoNextDelaySeconds: number;
  autoplay: boolean;
}
