import { useState } from 'react'
import { useSubmitContact } from '../lib/contactQueries'
import { errorText } from '../lib/errorText'

export default function FeedbackForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const submitContact = useSubmitContact()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    submitContact.mutate(
      { name: name.trim(), email: email.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setName('')
          setEmail('')
          setMessage('')
        },
      },
    )
  }

  if (submitContact.isSuccess) {
    return (
      <div>
        <h3 className="mb-3 text-sm font-medium text-neutral-200">Feedback</h3>
        <p className="animate-fade-in text-sm text-neutral-400">
          Thanks! Your message is on its way to us. 🎉
        </p>
        <button
          onClick={() => submitContact.reset()}
          className="mt-2 text-sm text-red-400 hover:text-red-300"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-neutral-200">Feedback</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-1/2 text-sm"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-1/2 text-sm"
          />
        </div>
        <textarea
          required
          placeholder="Tell us what's on your mind…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="input resize-none text-sm"
        />
        {submitContact.isError && (
          <p className="text-xs text-red-400">{errorText(submitContact.error)}</p>
        )}
        <button
          type="submit"
          disabled={submitContact.isPending || !message.trim()}
          className="shine-hover self-start rounded-md bg-gradient-to-r from-red-600 via-fuchsia-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitContact.isPending ? 'Sending…' : 'Send Feedback'}
        </button>
      </form>
    </div>
  )
}
