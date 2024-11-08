export interface Question {
  id: number;
  section: "cliente" | "negocio" | "coherencia" | "alineacion" | "circulo" | "financiera";
  question: string;
  options: string[];
  subsection?: "que" | "como" | "por que"
}
