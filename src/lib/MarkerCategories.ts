import { LucideProps, User, Users } from 'lucide-react'
import { FunctionComponent } from 'react'
import colors from 'tailwindcss/colors'

export enum Category {
  CAT1 = 'RT 1',
  CAT2 = 'RT 2',
  CAT3 = 'RT 3',
  // CAT4 = 'RT 4',
  CAT5 = 'RT 5',
  USER = 'User',
}

export interface MarkerCategoriesValues {
  name: string
  icon: FunctionComponent<LucideProps>
  color: string
  hideInMenu?: boolean
}

type MarkerCategoryType = {
  [key in Category]: MarkerCategoriesValues
}

const MarkerCategories: MarkerCategoryType = {
  [Category.CAT1]: {
    name: Category.CAT1,
    icon: Users,
    color: colors.blue[400],
  },
  [Category.CAT2]: {
    name: Category.CAT2,
    icon: Users,
    color: colors.red[400],
  },
  [Category.CAT3]: {
    name: Category.CAT3,
    icon: Users,
    color: colors.green[400],
    hideInMenu: false,
  },
  // [Category.CAT4]: {
  //   name: Category.CAT4,
  //   icon: Users,
  //   color: colors.stone[400],
  //   hideInMenu: false,
  // },
  [Category.CAT5]: {
    name: Category.CAT5,
    icon: Users,
    color: colors.pink[400],
    hideInMenu: false,
  },
  [Category.USER]: {
    name: 'You',
    icon: User,
    color: colors.cyan[400],
    hideInMenu: false,
  },
}

export default MarkerCategories
