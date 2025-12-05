
import { CurriculumItem } from './types';

const originalCurriculum: Omit<CurriculumItem, 'id'>[] = [
    // Fundamental - Modelo Básico
    { graduation: 'Fundamental', subGroup: 'Modelo Básico', study: 'Expressão do Crescimento Vertical (Tyokusseitai) (直生体)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Modelo Básico', study: 'Expressão do Crescimento Oblíqua (Shasseitai) (斜生体)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Modelo Básico', study: 'Expressão do Crescimento Horizontal (Ousseitai) (横生体)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Modelo Básico', study: 'Expressão do Crescimento Pendente (Suisseitai) (垂生体)', varietySuggestion: 'Moribana' },
    
    // Fundamental - Desenvolvimento do Modelo Básico
    { graduation: 'Fundamental', subGroup: 'Desenvolvimento do Modelo Básico', study: 'Agrupamento (Shugo) (集合)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Desenvolvimento do Modelo Básico', study: 'Expressão de Três Faces (Sanpo Shomen) (三方正面)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Desenvolvimento do Modelo Básico', study: 'Expressão de Quatro Faces (Shiho Shomen) (四方正面)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Desenvolvimento do Modelo Básico', study: 'Centro de Mesa (Takujyoka) (卓上花)', varietySuggestion: 'Moribana' },
    
    // Fundamental - Aprofundamento do Modelo Básico
    { graduation: 'Fundamental', subGroup: 'Aprofundamento do Modelo Básico', study: 'Expressão de Simplificação (Shoryaku) (省略)', varietySuggestion: 'Moribana' },
    { graduation: 'Fundamental', subGroup: 'Aprofundamento do Modelo Básico', study: 'Expressão de Ângulo Forma completa/estrutural (Taikaku) (体格)', varietySuggestion: 'Moribana' },

    // Intermediário - Aprofundamento do Modelo Básico (Nageire)
    { graduation: 'Intermediário', subGroup: 'Aprofundamento do Modelo Básico', study: 'Técnicas de fixação', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Aprofundamento do Modelo Básico', study: 'Coesão de Duas Linhas (Nikaku Kossei) (二格構成)', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Aprofundamento do Modelo Básico', study: 'Expressão de Simplificação (Shoryaku) (省略)', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Aprofundamento do Modelo Básico', study: 'Expressão de Ângulo Forma completa/estrutural (Taikaku) (体格)', varietySuggestion: 'Nageire' },

    // Intermediário - Estudo de Linhas (Moribana)
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Reta (Tyoku Sen) (直線) Radiante', varietySuggestion: 'Moribana' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Reta (Tyoku Sen) (直線) Oblíqua', varietySuggestion: 'Moribana' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Reta (Tyoku Sen) (直線) Paralela', varietySuggestion: 'Moribana' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Curva (Kyoku Sen) (曲線) Curva semicircular', varietySuggestion: 'Moribana' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Curva (Kyoku Sen) (曲線) Dinâmica', varietySuggestion: 'Moribana' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Curva (Kyoku Sen) (曲線) Sinuosas', varietySuggestion: 'Moribana' },

    // Intermediário - Estudo de Linhas (Nageire)
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Reta (Tyoku Sen) (直線) Radiante', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Reta (Tyoku Sen) (直線) Oblíqua', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Curva (Kyoku Sen) (曲線) Curva semicircular', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Curva (Kyoku Sen) (曲線) Dinâmica', varietySuggestion: 'Nageire' },
    { graduation: 'Intermediário', subGroup: 'Estudo de Linhas', study: 'Linha Curva (Kyoku Sen) (曲線) Sinuosas', varietySuggestion: 'Nageire' },

    // Avançado - Sen Men Massu (Moribana)
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha (Sen) (線)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Face (Men) (面)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Volume (Massu) (塊)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Face e Volume (Men Massu) (面塊)', varietySuggestion: 'Moribana' },
    
    // Avançado - Sen Men Massu (Nageire)
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha (Sen) (線)', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Face (Men) (面)', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Volume (Massu) (塊)', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Face e Volume (Men Massu) (面塊)', varietySuggestion: 'Nageire' },

    // Avançado - Combinações (Moribana)
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha e Face (Sen Men) (線面)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha e Volume (Sen Massu) (線塊)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Face e Volume (Men Massu) (面塊)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha, Face e Volume (Sen Men Massu) (線面塊)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Segmentação (Bunkatsu) (分割)', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Conjunto (Heigo) (併合) Combinação/União', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Cruzamento (kossa) (交差)', varietySuggestion: 'Moribana' },

    // Avançado - Combinações (Nageire)
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha e Volume (Sen Massu) (線塊)', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Estudo de Linha, Face e Volume (Sen Men Massu) (線面塊)', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Conjunto (Heigo) (併合) Combinação/União', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume)', study: 'Cruzamento (kossa) (交差)', varietySuggestion: 'Nageire' },

    // Avançado - Diversos Materiais (Moribana)
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Linha (Sen) (線) com Flor /e ou Folha', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Face (Men) (面) Fina, Larga, Grande, Pequena..', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Volume (Massu) (塊) com Galho e Fruto', varietySuggestion: 'Moribana' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Linha, Face e Volume (Sen Men Massu) (線面塊)', varietySuggestion: 'Moribana' },

    // Avançado - Diversos Materiais (Nageire)
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Linha (Sen) (線) com Flor /e ou Folha', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Face (Men) (面) Fina, Larga, Grande, Pequena..', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Volume (Massu) (塊) com Galho e Fruto', varietySuggestion: 'Nageire' },
    { graduation: 'Avançado', subGroup: 'Sen Men Massu (Linha, Face e Volume) Diversos materiais', study: 'Linha, Face e Volume (Sen Men Massu) (線面塊)', varietySuggestion: 'Nageire' },

    // Senshukai - Utilização do Vaso
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Estudo do Vaso', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Estudo de Cor', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Translúcido', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Detalhe do Vaso', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Estudo do Vaso', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Estudo de Cor', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Translúcido', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando / Estudo da Utilização do Vaso', study: 'Detalhe do Vaso', varietySuggestion: 'Nageire' },

    // Senshukai - Ambiente
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Expressão de Três Faces (Sanpo - Shomen) (三方正面)', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Expressão de Quatro Faces (Shiho-Shomen) (四方正面)', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Expressão de Centro de Mesa (Takujyoka) (卓上花)', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Expressão de Três Faces (Sanpo - Shomen) (三方正面)', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Expressão de Quatro Faces (Shiho-Shomen) (四方正面)', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Expressão de Centro de Mesa (Takujyoka) (卓上花)', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Vivificação na Parede (Kakebana) (掛花)', varietySuggestion: 'N/A' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Vivificação Pendente (Tsuribana) (釣花)', varietySuggestion: 'N/A' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Mukaebana (迎花) - "Flor de boas-vindas" recepção', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Mukaebana (迎花) - "Flor de boas-vindas" recepção', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Estudo do Ambiente', study: 'Taisaku (対作) - Arranjo em par/composição dupla', varietySuggestion: 'Nageire' },

    // Senshukai - Conteúdos Interiorizados
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo de Assimetria', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo de Harmonia e Contraste', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo de Cor', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo do Vaso (Proporção Desproporção)', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo de Assimetria', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo de Harmonia e Contraste', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo de Cor', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Aperfeiçoando de conteúdos interiorizados', study: 'Estudo do Vaso (Proporção Desproporção)', varietySuggestion: 'Nageire' },

    // Senshukai - Qualidade do Material
    { graduation: 'Senshukai', subGroup: 'Percepção da Qualidade do Material', study: 'Expressão de Modernidade (Guendaifu) (現代風) Estilo contemporâneo', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Percepção da Qualidade do Material', study: 'Expressão de Suavidade (Fuga) (風雅) Elegancia', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Percepção da Qualidade do Material', study: 'Expressão de Maturidade (Fukaku) (深格) Forma profunda/avançada', varietySuggestion: 'Moribana' },
    { graduation: 'Senshukai', subGroup: 'Percepção da Qualidade do Material', study: 'Expressão de Modernidade (Guendaifu) (現代風) Estilo contemporâneo', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Percepção da Qualidade do Material', study: 'Expressão de Suavidade (Fuga) (風雅) Elegancia', varietySuggestion: 'Nageire' },
    { graduation: 'Senshukai', subGroup: 'Percepção da Qualidade do Material', study: 'Expressão de Maturidade (Fukaku) (深格) Forma profunda/avançada', varietySuggestion: 'Nageire' },
];

export const IKEBANA_CURRICULUM: CurriculumItem[] = originalCurriculum.map((item, index) => ({
  ...item,
  id: index + 1,
}));

export const GRADUATIONS = ['Fundamental', 'Intermediário', 'Avançado', 'Senshukai'];
