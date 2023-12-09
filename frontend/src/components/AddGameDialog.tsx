
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import {useGraphStore} from "@/stores/graphStore"
import axios from "axios"
import { env } from "@/env"


const formSchema = z.object({
  gamenr: z.string().min(3, {
    message: "Game number is represented like: 1st, 2nd, 3rd.",
  }),
  gamedate: z.string().min(10, {
    message: "Format: YYYY-MM-DD.",
  }),
  
})

export default function AddGameDialog() {
  const {fetchGraph} = useGraphStore();
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gamenr: "Xth",
      gamedate: "1999-01-01",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    const response = axios.post(`${env.PUBLIC_API_URL}/add_game/`, values)
    console.log(response)
    fetchGraph();
    console.log(values)
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Game Node</DialogTitle>
        </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="gamenr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Game number</FormLabel>
                      <FormControl>
                        <Input placeholder="1st" {...field} />
                      </FormControl>
                      <FormDescription>
                        Game number is represented like: 1st, 2nd, 3rd.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gamedate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of the game</FormLabel>
                      <FormControl>
                        <Input placeholder="YYYY-MM-DD" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: YYYY-MM-DD. You should stick to this format...
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
          </Form>
      </DialogContent>
    </Dialog>
  )
}