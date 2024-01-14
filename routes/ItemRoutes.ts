import express from 'express'
import { getAllItems, updateItem, postItem, deleteItem } from '../controllers/ItemController'

const router = express.Router()

router.route("/").get(getAllItems).post(postItem).patch(updateItem).delete(deleteItem)

export default router