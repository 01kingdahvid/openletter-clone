import { createClient } from '@/lib/supabase/server'
import LetterBody from '@/components/letter/LetterBody'
import SignatureCount from '@/components/letter/SignatureCount'
import SignatureForm from '@/components/letter/SignatureForm'
import SignatureList from '@/components/letter/SignatureList'
import styles from './page.module.css'

export const revalidate = 60

export default async function HomePage () {
  const supabase = await createClient() // ✅ FIX HERE

  const { count } = await supabase
    .from('signatures')
    .select('*', { count: 'exact', head: true })
    .eq('verified', true)

  const { data: recent } = await supabase
    .from('signatures')
    .select('full_name')
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: signatures } = await supabase
    .from('signatures')
    .select('id, full_name, job_title, organization, country')
    .eq('verified', true)
    .order('created_at', { ascending: false })
    .limit(60)

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>Open Letter</p>
          <h1 className={styles.title}>
            A Call for Responsible AI Development
          </h1>
          <p className={styles.subtitle}>
            We, the undersigned, urge governments, research institutions, and
            technology companies to adopt transparent, accountable, and
            human-centred frameworks for artificial intelligence.
          </p>
        </header>

        <div className={styles.layout}>
          <div className={styles.letterCol}>
            <LetterBody />
            <SignatureList signatures={signatures} />
          </div>
          <aside className={styles.sidebar}>
            <SignatureCount initial={count || 0} lastSigners={recent || []} />
            <div className={styles.stickyForm}>
              <SignatureForm />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
