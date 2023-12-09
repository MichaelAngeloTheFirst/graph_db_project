
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
    name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
    funclub: z.string().min(2, {
    message: "Fuhnclub Name must be at least 2 characters.",
  }),
  
})

export default function AddTeamDialog() {
  const {fetchGraph} = useGraphStore();
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "team name",
      funclub: "funclub name",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    const response = axios.post(`${env.PUBLIC_API_URL}/add_team/`, values)
    console.log(response)
    fetchGraph();
    console.log(values)
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Team Node</DialogTitle>
        </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Club Name</FormLabel>
                      <FormControl>
                        <Input placeholder="club name" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="funclub"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funclub</FormLabel>
                      <FormControl>
                        <Input placeholder="funclub" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name of the funclub.
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