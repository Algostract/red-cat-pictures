export default function (
  title: {
    plain_text: string
  }[]
) {
  return title.map(({ plain_text }) => plain_text ?? '').join('') as string
}
