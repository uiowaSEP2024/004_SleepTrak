// Questions
//  We can figure out a better way to populate these later.
const questionData = [
  {
    questionId: '1',
    description: 'What is your first name?',
    type: 'small-text',
    onboarding_screen: 1
  },
  {
    questionId: '2',
    description: 'What is your last name?',
    type: 'small-text',
    onboarding_screen: 2
  },
  {
    questionId: '3',
    description: "What is your Baby's name?",
    type: 'small-text',
    onboarding_screen: 3
  },
  {
    questionId: '4',
    description: 'When was your Baby born?',
    type: 'date',
    onboarding_screen: 4
  },
  {
    questionId: '5',
    description: 'Does your child have any medical conditions?',
    type: 'large-text',
    onboarding_screen: 5
  },
  {
    questionId: '6',
    description:
      "Briefly describe your child's sleep environment - Where do they sleep? Who do they sleep with? Do they have a routine? What is the environment like? ",
    type: 'large-text',
    onboarding_screen: 6
  },
  {
    questionId: '7',
    description:
      "Please tell me briefly what your child's day looks like in terms of sleep and feeds: Example: 7am wakes up, 9am eats, 10am nap...",
    type: 'large-text',
    onboarding_screen: 7
  },
  {
    questionId: '8',
    description: 'How does your child fall asleep at night?',
    type: 'large-text',
    onboarding_screen: 8
  },
  {
    questionId: '9',
    description: 'How many times does your child wake up per night?',
    type: 'number',
    onboarding_screen: 9
  },
  {
    questionId: '10',
    description:
      'Have you tried any methods to help your baby sleep better in the past? Tell me in detail about your experience.',
    type: 'large-text',
    onboarding_screen: 10
  },
  {
    questionId: '11',
    description: 'What sleep goals would you like to achieve?',
    type: 'large-text',
    onboarding_screen: 11
  },
  {
    questionId: '12',
    description:
      'Have you started implementing my Baby/Toddler Sleep Learning program?',
    type: 'yes-no',
    onboarding_screen: 12
  },
  {
    questionId: '13',
    description:
      "Please tell me in detail any additional information that can help me understand your child & family's sleep situation.",
    type: 'large-text',
    onboarding_screen: 13
  }
];

export default questionData;
