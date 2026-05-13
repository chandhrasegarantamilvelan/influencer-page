import { CollaborationRequestForm } from "@/components/forms/CollaborationRequestForm";

export const metadata = {
  title: "Collaborate | Influencer Portfolio",
  description: "Submit a collaboration request to partner with us on your next campaign.",
};

export default function CollaboratePage() {
  return (
    <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Let&apos;s Collaborate
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Interested in working together? Fill out the form below with your collaboration details and we&apos;ll get back to you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <CollaborationRequestForm />
        </div>
      </div>
    </main>
  );
}
