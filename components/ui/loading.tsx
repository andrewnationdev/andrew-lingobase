export default function LoadingComponent(){
	return (
		<div aria-live="polite" className="flex items-center gap-3">
			<span className="sr-only">Currently Loading...</span>

			<div className="flex items-center space-x-2">
				<span className="w-2.5 h-2.5 bg-gray-700 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
				<span className="w-2.5 h-2.5 bg-gray-700 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
				<span className="w-2.5 h-2.5 bg-gray-700 dark:bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
			</div>

			<span className="text-sm text-gray-700 dark:text-gray-200">Currently Loading...</span>
		</div>
	)
}