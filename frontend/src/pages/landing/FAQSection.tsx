import { StarsBgIllustration } from '@/assets/illustrations'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

const FAQSection = () => {
  const faqs = [
    {
      rand: 'aX',
      question: 'What can I do with this app?',
      answer:
        'You can save, organize, and back up your contacts all in one place. It’s like your personal phonebook that also lets you export contacts when you need them.'
    },
    {
      rand: 'pQ',
      question: 'Do I need an account?',
      answer:
        'You’ll need to sign up with your email so your contacts stay safe and you can access them from anywhere but you can get working right away.'
    },
    // {
    //   "rand": "zM",
    //   "question": "Can I bring in my old contacts?",
    //   "answer": "Of course! You can import contacts from your phone or upload a VCF/CSV file. We’re also working on easier one-click imports from popular services."
    // },
    {
      rand: 'nL',
      question: 'How do I download my contacts?',
      answer:
        'You can export them as VCF, JSON, CSV, or Excel files, which work almost everywhere—from phones to email apps.'
    },
    {
      rand: 'rK',
      question: 'Is my information safe?',
      answer:
        'Yes. Your contacts are encrypted and stored securely. We don’t sell or share your data—period.'
    },
    {
      rand: 'tV',
      question: 'Can I sort contacts into groups?',
      answer: 'Yep! You can add tags or create groups so your contacts stay organized.'
    },
    {
      rand: 'gB',
      question: 'Does it work offline?',
      answer:
        'Yes. You can add or edit contacts without the internet, and your changes will sync when you’re back online.'
    },
    {
      rand: 'yW',
      question: 'Can I share contacts with others?',
      answer:
        'Not just yet, but a shared lists feature is on the way so teams and friends can collaborate.'
    },
    {
      rand: 'eD',
      question: 'Which file types are supported?',
      answer:
        'Right now, you can export in VCF, JSON, CSV and XLSX( Excel ). For imports, VCF and CSV are supported, with options to match custom fields.'
    },
    {
      rand: 'uF',
      question: 'What if I lose access to my account?',
      answer:
        'No worries—you can recover it with your registered email. Once you log back in, your contacts will be right where you left them.'
    }
  ]

  return (
    <section className="relative isolate mt-24 px-16">
      <div className="absolute -left-4 -translate-y-1/2 -z-10">
        <StarsBgIllustration className="w-[200px] xl:w-[400px]" />
      </div>
      <h1 className="text-center text-xl font-bold">Frequently Asked Questions</h1>
      <div className="mx-auto mt-8 md:max-w-[60vw]">
        <Accordion type="single" collapsible>
          {faqs.map(faq => {
            return (
              <AccordionItem value={faq.rand} key={faq.rand}>
                <AccordionTrigger className="font-bold text-neutral-500 underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-balance">{faq.answer}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQSection
