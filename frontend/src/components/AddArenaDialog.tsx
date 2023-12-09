
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


const formSchema = z.object({
  arena: z.string().min(2, {
    message: "Arena name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location  must be minimum 0.",
  }),
  
})

export default function AddArenaDialog() {
  const {fetchGraph} = useGraphStore();
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      arena: "arena name",
      location: "somewhere",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    const response = axios.post("http://localhost:8000/add_arena/", values)
    console.log(response)
    fetchGraph();
    console.log(values)
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Arena</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Arena Node</DialogTitle>
        </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="arena"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arena Name</FormLabel>
                      <FormControl>
                        <Input placeholder="arena name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Arena Name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="In the middle of Nowhere" {...field} />
                      </FormControl>
                      <FormDescription>
                        Location of the Arena
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