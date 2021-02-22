// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE
// DO NOT MAKE CHANGES TO THIS FILE

import 'regenerator-runtime'

import { cardAppender } from './components/card'
import { headerAppender } from './components/header'
import { tabsAppender } from './components/tabs'
import { worker } from './mocks/browser'

worker.start()

headerAppender('.header-container')
tabsAppender('.tabs-container')
cardAppender('.cards-container')
