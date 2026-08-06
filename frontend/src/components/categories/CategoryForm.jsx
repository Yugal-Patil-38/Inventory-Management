import { useState } from 'react'
import Input from '../common/Input'
import Textarea from '../common/Textarea'
import Button from '../common/Button'

function CategoryForm({ category, onSubmit, onCancel, isSubmitting, error }) {
  const [name, setName] = useState(category ? category.name : '')
  const [description, setDescription] = useState(
    category ? category.description : ''
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name, description })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="e.g. Electronics"
        required
        error={error}
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        rows={3}
        placeholder="What belongs in this category?"
        className="mt-4"
      />

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Saving' : 'Save category'}
        </Button>
      </div>
    </form>
  )
}

export default CategoryForm
