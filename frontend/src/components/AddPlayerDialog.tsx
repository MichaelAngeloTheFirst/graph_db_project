
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
  lastname: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  playernumber: z.coerce.number().min(0, {
    message: "Player number must be minimum 0.",
  }),
  
})

export default function AddPlayerDialog() {
  const {fetchGraph} = useGraphStore();
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastname: "lastname",
      playernumber: 0,
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    const response = axios.post("http://localhost:8000/add_player/", values)
    console.log(response)
    fetchGraph();
    console.log(values)
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Player</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Player Node</DialogTitle>
        </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="last name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Player's last name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="playernumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player Number</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number on the back of the player's jersey.
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