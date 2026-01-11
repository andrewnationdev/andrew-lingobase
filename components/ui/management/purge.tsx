import { supabase } from "@/lib/supabase/database";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

interface IPurgeDictionaryProps {
  langCode: string;
}

export default function PurgeDictionarySectionComponent(
  props: IPurgeDictionaryProps
) {
  const handlePurgeDictionary = async () => {
    const _prompt = confirm(
      "Are you sure you want to delete the dictionary? This cannot be undone and won't delete other data related to your conlang!"
    );

    if (_prompt) {
      try {
        const delete_dict = async () => {
          const req = await supabase
            .from("conlang-dictionary")
            .delete()
            .eq("conlang_code", props.langCode);

          if (req?.status === 204) {
            showSuccessToast("Dictionary purged successfully.");
            window.location.reload();
          } else showErrorToast("Failed to purge dictionary.");
        };

        await delete_dict();
      } catch (err) {
        console.error(err);
        showErrorToast("An error occurred while purging the dictionary.");
      }
    }
  };

  return (
    <button
      onClick={handlePurgeDictionary}
      className="transition duration-150 ease-in-out hover:scale-125 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
    >
      Purge Dictionary (SOON!)
    </button>
  );
}
