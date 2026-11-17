/** Uma foto do perfil: o anexo de imagem de uma publicação da pessoa, já resolvido em URL. */
export type ProfilePhoto = {
  id: string;
  mediaUrl: string;
  description: string | null;
  mediaSpoiler: boolean;
};
