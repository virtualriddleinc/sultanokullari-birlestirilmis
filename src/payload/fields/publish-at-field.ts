/** Zamanlanmış yayın alanı — haber/etkinlik/sayfa */
export const publishAtField = {
  name: "publishAt",
  type: "date" as const,
  label: "Zamanlanmış yayın",
  admin: {
    position: "sidebar" as const,
    date: {
      pickerAppearance: "dayAndTime" as const,
    },
    description:
      "Gelecek bir tarih seçilirse kayıt taslakta kalır; zamanı gelince cron ile yayınlanır. Yalnızca yönetici.",
  },
};
