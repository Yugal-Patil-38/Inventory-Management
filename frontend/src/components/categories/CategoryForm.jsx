import { useState } from 'react'
import Input from '../common/Input'
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

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          placeholder="What belongs in this category?"
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

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
