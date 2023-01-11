export interface INav {
  links: { label: string; to: string; disabled?: boolean }[];
  button?: { label: string; open: () => void };
}
