export const PRESET_BACKGROUNDS = Array.from({ length: 6 }, (_, index) => {
  const id = index + 1

  return {
    id: `background-${id}`,
    label: `Background ${id}`,
    src: `/assets/backgrounds/background-${id}.jpg`,
  }
})
