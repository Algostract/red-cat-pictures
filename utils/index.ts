interface Image {
  type: 'food' | 'product'
  id: string
  name: string
  title: string
}

const images: Image[] = [
  // Food
  {
    type: 'food',
    id: '9e82456d-78e0-4df0-a152-566327697ef7',
    name: 'Food-004-001',
    title: 'Herbal tea in a glass teapot and cup with lemon slices, mint leaves, and honey dipper on a wooden tray',
  },
  {
    type: 'food',
    id: '69dcabdd-d9da-419a-a823-285d34db4f95',
    name: 'Food-002-001',
    title: 'Spicy grilled chicken wings with onion rings on a black plate, garnished with chili flakes',
  },
  {
    type: 'food',
    id: 'd4857636-289b-4e4d-a29f-8e3a42617eb4',
    name: 'Food-003-001',
    title: 'Food Photography of Stack of fluffy pancakes with fresh strawberries and honey drizzle on a wooden board',
  },
  {
    type: 'food',
    id: '50071c98-e75c-4673-a105-1ae104b6eb35',
    name: 'Food-001-001',
    title: 'Close-up of a traditional Indian chicken biryani dish on a banana leaf, garnished with onions, cucumbers, and yogurt',
  },
  {
    type: 'food',
    id: 'badf3211-af49-4991-b573-303d8f485440',
    name: 'Food-005-001',
    title: 'A juicy cheeseburger on a wooden cutting board, served with a side of golden french fries',
  },
  {
    type: 'food',
    id: '17b026dd-bc91-4c14-bb34-9901e13ba7f8',
    name: 'Food-007-001',
    title: 'A bowl of stew with a hard-boiled egg and a slice of bread on a wooden cutting board',
  },
  {
    type: 'food',
    id: '937b5072-2414-4d42-9006-5314f0b1682a',
    name: 'Food-006-001',
    title: 'A close-up of a plate of jiaozi dumplings with chopsticks and green onions on a blue table',
  },
  {
    type: 'food',
    id: '7873bdc2-a518-440d-a8d9-9dd5a13f332e',
    name: 'Food-009-001',
    title: 'Skewers of chicken lollipops and colorful bell peppers on a metal tray with a red napkin, knife, and fork',
  },
  {
    type: 'food',
    id: '2c3e85c4-5562-4bc6-91bb-5ffb2cf95160',
    name: 'Food-008-001',
    title: 'Two chocolate chip muffins, one with a bite taken out, on a wooden cutting board',
  },
  {
    type: 'food',
    id: '9d7e283c-f017-40f5-b688-8af1a6f5d84c',
    name: 'Food-006-002',
    title: 'A bowl of momo with green onions on a blue table. The momo are filled with chicken and vegetables',
  },
  // Profucts
  {
    type: 'product',
    id: '3011bb6e-b6cc-4de8-b829-793e17a23db9',
    name: 'Product-001-001',
    title: 'A pair of black sneakers with white soles on a black box against a black background',
  },
  {
    type: 'product',
    id: 'c2a0dbd9-0ad4-4526-9f2f-3e95c2e3957d',
    name: 'Product-003-001',
    title: 'A bottle of French Essence Luxury Urban Eau de Parfum for Men. The bottle is a sleek black glass with a silver cap',
  },
  {
    type: 'product',
    id: 'bfec22b7-c27b-4ad3-9765-9d33484d6723',
    name: 'Product-004-001',
    title: 'Close-up of a BENYAR skeleton watch on a black background. The watch has a gold-colored case and a black leather strap',
  },
  {
    type: 'product',
    id: 'cfed72bc-cbfa-4ab0-b30c-1eb17ae431b2',
    name: 'Product-004-002',
    title: 'A close-up photo of a silver mechanical wristwatch with a black leather band',
  },
  {
    type: 'product',
    id: '9a34beb4-211d-418b-afe4-727b36a64039',
    name: 'Product-005-001',
    title: 'Black keyboard with rainbow LED backlight on a white background',
  },
  {
    type: 'product',
    id: 'fa4134de-c4ef-467f-b750-a5f6b6d8a3fb',
    name: 'Product-006-001',
    title: 'A pair of black Kaen sunglasses with a rectangular frame and blue mirrored lenses on a black background',
  },
  {
    type: 'product',
    id: '35899c6d-4a02-4979-bf88-55afe2d48a07',
    name: 'Product-007-001',
    title:
      'Three pairs of sunglasses in a row on a white background. From left to right, the first pair has a black frame and gray lenses, the second pair has a tortoiseshell frame and brown lenses, and the third pair has a gold frame and mirrored lenses.',
  },
  {
    type: 'product',
    id: 'ab7cab7e-d43e-4c48-a0e6-845db7b14c1d',
    name: 'Product-002-001',
    title: 'A pair of white tennis shoes with neon green laces against a gray background',
  },
  {
    type: 'product',
    id: '76d57406-39d6-42bb-b1e4-5b0c2d0f48e3',
    name: 'Product-002-002',
    title: 'Close-up of a pair of classic white tennis shoes',
  },
  {
    type: 'product',
    id: 'c048ef8c-20d4-4b6b-be6f-103a56b2ba8b',
    name: 'Product-001-002',
    title: 'A black and white sneaker with red shoelaces floating in mid-air on a black background.',
  },
]

export function getImages(imageNames: string[]): Image[] {
  const selectedImages = imageNames.map((name) => images.find((image) => image.name === name))
  const filteredImages = selectedImages.filter((image) => image !== undefined)
  return filteredImages
}
